---
title: 'Airflow XComs'
date: 2023-02-28
tags: ['airflow', 'data engineering', 'tools']
---

I have been using Airflow since version 1.10, published around 3 years ago. While I have written many DAGs for many use cases, I only realized a few days ago that I never used XComs. But why?

### Airflow is an orchestrator

One of the first questions many people ask after being introduced to Airflow is why there is no option to pass large data sets between Airflow tasks. The short but accurate answer is that if you want to pass data sets between tasks, you misunderstood Airflow.

Airflow is not an execution engine, so only lightweight tasks should be executed. Instead, it is built to orchestrate tasks. Any heavy loading should be done externally, for example, with Spark, dbt or AWS Lambda. Therefore, the use case to pass data sets between tasks is more or less non-existent.

Nevertheless, some use cases require passing information between tasks, which is what XComs are for. This could be some time stamps you queried from a database, parameters from a trained ML model or anything else qualifying as small-sized information required for the next task.

### XComs

XComs ("cross-communication") generally allow communication between tasks. Parameters can be passed from one task to another and are defined by a key, a value and a timestamp. They have to be pushed or pulled between tasks which can be done in two different ways (more on this later),

### Limitations of XComs

As mentioned before, XComs were not designed for passing large data sets. Nevertheless, it's difficult to actually define the limitations.

XComs are stored in the Airflow metadata database and are available for all other tasks. Technically, in a standard Airflow environment running a Postgres database, the size limit of an XCom is 1 GB. However, this limit should not be considered a reasonable limit for XComs. Writing complex data like pandas data frames is slow and takes up a lot of space.

Apart from that, XComs do not have any authorization or encryption. That means anyone with access to the database and any DAG could access the information. That also means that any sensitive data should be encrypted before passing it to an XCom.

### Example

Let's look at an example using XComs.

```python
import logging
import random

from datetime import datetime, timedelta

from airflow import DAG, AirflowException
from airflow.operators.python_operator import PythonOperator


def generate_random_number(ti):
    number = random.randint(1, 10)
    ti.xcom_push(key="random_number", value=number)

def guess_number(ti):
    guess = random.randint(1, 10)
    number = ti.xcom_pull(key="random_number", task_ids="generate_random_number")

    if guess == number:
        logging.info(
            f"Congratulations, your guess was right! Number: {number}, guess: {guess}"
        )
    else:
        raise AirflowException(f"Wrong guess! Number: {number}, guess: {guess}")

with DAG(
    "xcom_guess",
    start_date=datetime(2023, 2, 27),
    schedule=timedelta(minutes=5),
) as dag:
    generate_random_number = PythonOperator(
        task_id="generate_random_number", python_callable=generate_random_number
    )

    guess_number = PythonOperator(task_id="guess_number", python_callable=guess_number)

    generate_random_number >> guess_number
```

This DAG consists of two tasks using the PythonOperator. The first one is using `xcom_push` to pushed a random number to XCom. This can be done either explicitly (like here) or by return the value from the function.

In the second function, after generating a random guess, the value is pulled using `xcom_pull`, using the key and task_id as parameters. If both numbers are equal, the task is sucessful. If not, an exception is thrown and the task fails.

You can also check the XCom values in the Airflow UI. If you want to see only the XComs of the current run, you can check them in the task menu.

{% myImage "./src/assets/images/airflow-xcoms1.png", "XComs in Airflow UI", "post" %}

There is also a long list of all XComs in Admin -> XComs:

{% myImage "./src/assets/images/airflow-xcoms2.png", "XComs in Admin interface", "post" %}

### Using TaskFlow API

The previous example showed an explicit way to use XComs. Since Airflow 2.0 it's also possible to define DAGs using the TaskFlow API. TaskFlow allows writing tasks without any tedious pushing/pulling of XCom variables. All you have to do is defining the flow between the tasks and returning the required values from each task.

Adjusting the previous DAG to use the TaskFlow API would look like this:

```python
import logging
import random
from datetime import datetime, timedelta

from airflow import AirflowException
from airflow.decorators import dag, task


@dag("xcom_guess", start_date=datetime(2023, 2, 27), schedule=timedelta(minutes=5))
def taskflow():
    @task
    def generate_random_number():
        number = random.randint(1, 10)
        return number

    @task
    def guess_number(number: int):
        guess = random.randint(1, 10)
        if guess == number:
            logging.info(
                f"Congratulations, your guess was right!\n
                Number: {number}, guess: {guess}"
            )
        else:
            raise AirflowException(f"Wrong guess! Number: {number}, guess: {guess}")

    guess_number(generate_random_number())

dag = taskflow()
```

As mentioned before, there is no pushing/pulling anymore. Instead, tasks are defined using decorators and then running one task as the input of the other.

There is no difference between both ways to implement the DAG. However, I think using the TaskFlow API makes it easier to understand the dependencies between tasks. Especially for complex DAGs that consist of many tasks, it can be challenging to understand from the code which tasks use which return value.

Another advantage is that this syntax might make it easier to understand that any returned value is saved as an XCom. With the old DAG definition syntax, data can be returned from a function without intention and only recognized after the database has started growing in size massively.
