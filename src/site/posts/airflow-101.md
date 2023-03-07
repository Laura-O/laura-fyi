---
title: 'Airflow 101'
date: 2023-05-17
tags: ['airflow', 'data engineering', 'tools']
---

Airflow is a platform for creating, scheduling, and monitoring workflows. You can define complex pipelines as directed acyclic graphs (DAGs) that define subtasks and dependencies between subtasks. Airflow is often considered as quite complex to install

## Installing Airflow

Depending on your use case and your operating system, there are different ways to install Airflow. In this article, I'll focus on installing Airflow using the official Docker Compose file on a Unix/Linux system. It works both with a Mac and a WSL2 subsystem on Windows. In my experience, this is the easiest and smoothest way.

You can download the Airflow Docker Compose file from the official Airflow GitHub repository. Navigate to your prefered directory and run:

```bash
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.5.1/docker-compose.yaml'
```

This will download the Docker Compose file to your current directory. Once the file has downloaded, you can use Docker Compose to start the Airflow services. After that, you need to create folders for dags, logs and plugins and create an .env file with your user id.

```bash
mkdir -p ./dags ./logs ./plugins
echo -e "AIRFLOW_UID=$(id -u)" > .env
```

Otherwise, those folders would be created as root which will cause issues when mounting them as volumes. After that, you are ready to run:

```bash
docker-compose up -d
```

This will take some time as the individual Docker images need to be pulled first and then the database needs to be setup. If everything is running correctly, you should be able to access the Airflow web UI by opening a web browser and navigating to http://localhost:8080 after a few minutes. If you didn't change the settings, you can login with username and passowrd `airflow`.

## Configuring Airflow

Now that Airflow is running, you'll need to configure a few settings to get started. The main Airflow configuration file is located at airflow.cfg in the Docker container. You can edit this file by running the following command:

```bash
docker exec -it airflow_webserver_1 vi /opt/airflow/airflow.cfg
```

This will open up the configuration file in the vi text editor. You can make changes to the file by navigating with the arrow keys and editing the text. Once you're done making changes, you can save and exit the editor by pressing the Esc key and typing :wq.

Here are a few important configuration settings that you might want to update:

- executor: This setting determines the type of executor that Airflow will use to run your tasks. The default executor is the SequentialExecutor, which runs tasks sequentially in a single process. For production use, you'll want to use a more scalable executor, such as the CeleryExecutor, which runs tasks in parallel using a distributed task queue.
- sql_alchemy_conn: This is the connection string for the Airflow metadata database. By default, Airflow uses the PostgreSQL database included in the Docker Compose file. If you want to use a different database, you'll need to update this setting with the appropriate connection string.
- dags_folder: This setting determines the folder where Airflow will look for your DAG files. By default, this is set to /opt/airflow/dags, which is a folder inside the Docker container. If you want to use your own DAG files, you can mount a volume to this folder to make them available to Airflow.

Once you've updated the configuration file, you'll need to restart the Airflow services to apply the changes:

```bash
docker-compose down
docker-compose up -d
```

Creating DAGs

With Airflow installed and configured, you can start creating your own workflows as DAGs. A DAG is simply a collection of tasks that are arranged in a directed acyclic graph. Each task represents a unit of work that can be executed independently of other tasks.

To create a new DAG, you'll need to create a Python script that defines the tasks and their dependencies. Here's a simple example that creates a DAG with two tasks:

```python
from datetime import datetime
from airflow import DAG
from airflow.operators.bash_operator import BashOperator

dag = DAG(
    'hello_world',
    start_date=datetime(2021, 1, 1),
    schedule_interval='@once',
)

task1 = BashOperator(
    task_id='hello',
    bash_command='echo "Hello"',
    dag=dag,
)

task2 = BashOperator(
    task_id='world',
    bash_command='echo "World"',
    dag=dag,
)

task1 >> task2

```

In this script, we create a new DAG named 'hello_world' with a start date of January 1, 2021. The DAG is scheduled to run once, using the '@once' interval. We then define two tasks, one that echoes "Hello" and another that echoes "World". Finally, we specify that task2 depends on task1, using the >> operator.

To make this DAG available to Airflow, we'll need to save it to a file in the dags_folder directory that we configured earlier. For example, we could save this script to a file named hello_world.py in the dags_folder directory:

bash

/opt/airflow/dags/hello_world.py

Once you've saved the DAG file, Airflow will automatically detect it and add it to the list of available DAGs in the web UI. You should see a new DAG named 'hello_world' in the DAGs menu.

## Running DAGs

## Going further

In this article, we've covered the basics of getting started with Airflow, including how to install it using the official Docker Compose file, how to configure Airflow, how to create DAGs, and how to run them. With these steps, you should have a working Airflow environment and be able to create your own workflows as DAGs.

Airflow is a powerful platform that can help you automate complex workflows, but there is much more to learn beyond the basics. Some additional topics you may want to explore include:

- Operators: Airflow provides a wide range of operators for different tasks, such as BashOperator for running shell commands, PythonOperator for running Python code, and EmailOperator for sending emails. You can learn more about operators in the Airflow documentation.
- Sensors: Sensors are a type of operator that can be used to wait for external events or conditions to occur before continuing with a workflow. For example, you could use a FileSensor to wait for a file to appear in a directory before processing it. You can learn more about sensors in the Airflow documentation.
- Variables: Airflow allows you to define variables that can be used across your DAGs. Variables can help store configuration values or other shared data. You can learn more about variables in the Airflow documentation.
- Connections: Airflow allows you to define connections to external systems, such as databases, APIs, or cloud services. Operators can use connections to interact with these systems.
- Plugins: Airflow allows you to extend its functionality by writing plugins. Plugins can add new operators, sensors, hooks, or other components to Airflow. You can learn more about plugins in the Airflow documentation.
