---
title: 'Coding with AI'
date: 2023-02-25
tags: ['ai', 'coding']
summary: Many people discovered ChatGPT for code generation. But how well does it actually perform and are there alternatives?
---

Many people discovered ChatGPT for code generation. But how well does it actually perform and are there alternatives? In this post, I am looking at some options to let AI help with coding and evaluating the results.

<!-- excerpt -->

## Intro

ChatGPT has been everywhere in the last few months. Reading and hearing about how people use it and force it to make mistakes has been fun for a week or two, but it's getting tiring. For some reason, my LinkedIn feed still has at least one "Look how ChatGPT failed"-post every day, and I don't know what people are trying to prove with that.

At the same time, I am perplexed by software developers claiming that they are using ChatGPT to do their work. Statements like "This week, I didn't write a single line of code and only used ChatGPT" even made it to podcasts where people discussed which jobs AI might replace in the future.

For everyone who has seriously worked as a software developer, it is evident that AI cannot replace software developers soon. Yes, ChatGPT can generate code for a given problem description, but it is not good at solving problems, which is the main task of a software engineer. AI can support with specific tasks, though, and I am looking at some examples in this post.

## AI Pair Programming

Several services implement smart code completion, also called AI pair programming. The term is quite misleading and was probably invented by someone who has not much experience with pair programming. While pair programming is specifically beneficial when two people work together to discuss how something should be implemented, AI pair programming tools instead help with the next step. As soon as you decide what to implement and where to put the code, it suggests a solution.

The two most popular ones are [GitHub Copilot](https://github.com/features/copilot) and [Tabnine](https://www.tabnine.com/). GitHub Copilot is based on [OpenAI Codex](https://openai.com/blog/openai-codex/), a model for translating natural language to code based on GPT-3. According to a paper by OpenAI researchers, the model generated working code for given Python docstrings for more than 70% of the attempts. That's quite impressive but stillalso emphasizes that it requires basic coding skills (i.e., writing a docstring) to retrieve good results. Like ChatGPT, CodeX can also be used [on the OpenAI website](https://platform.openai.com/docs/guides/code) for free.

I have used Copilot for private projects for quite a while and liked it a lot. In the beginning (when it was still in technical preview), it mainly copied lines from GitHub code. Since then, it has improved and evolved a lot. Especially for code that implements generic tasks (like calculations or conversions), there is a high chance that Copilot suggests a complete function based on a doc string. For example, when you write `def reverse(self, x:int) -> int...` it would suggest the complete function, including a return value.

{% myImage "./src/assets/images/code-ai1.png", "GitHub Copilot code suggestion for a given docstring", "post" %}

Copilot also works well for writing tests. Just add the name "test" to a given function name and it does the job.

{% myImage "./src/assets/images/code-ai2.png", "GitHub Copilot test suggestion based on a given function", "post" %}

In contrast, Tabnine was a massive disappointment for me, though, and felt like a dumb auto-completion suggesting mostly useless or wrong code. While Copilot uses one large model, Tabnine is based on several smaller models that solve individual problems. This is probably also why it is more convenient to use Tabnine in local mode and train it with your own code (which is not possible with Copilot).

Even with a lot of context and well-named variables, the suggestions I received from Tabnine were often far from what you would expect. Using local mode, it worked well in large repositories with a lot of similar code. But this is far too easy compared to the problems I would expect such a model to solve. It was not smart but felt more like a tool for automatic copy and pasting.

There might be other use cases and circumstances where Tabnine works well (for example, in huge company code bases where everything is written in a similar style and language) but as someone who is working on many smaller projects, it just didn't work for me.

## Asking AI to write Code

As mentioned in the intro, one of the primary use cases of ChatGPT seems to be code generation. Of course, that was already possible with CodeX, but the boom of ChatGPT made many more aware of what is possible. Compared to the plugins mentioned before, this approach aims to translate textual problem descriptions into code instead of being integrated into an existing code base.

Doing this tasks is challenging for a model as it involves understanding a problem and generating suitable, functional code that solves this problem. In the past, many models failed to do the former reliably, and even with more specialized models, it still is a considerable challenge that is not solved by ChatGPT. However, let's have a look at the code ChatGPT generates.

### Asking ChatGPT to generate a weather app

I asked ChatGPT to write a Streamlit application that fetches weather data for Dortmund from a free API and displays it in a chart. This is what I got:

```python
import streamlit as st
import requests
import pandas as pd
import plotly.express as px

# Set up OpenWeatherMap API key
api_key = "YOUR_API_KEY_HERE"

# Define function to get weather data from OpenWeatherMap API
def get_weather_data():
    url = f"https://api.openweathermap.org/data/2.5/onecall?lat=51.5134&lon=7.4814&exclude=hourly,minutely&appid={api_key}&units=metric"
    response = requests.get(url)
    data = response.json()
    return data

# Get weather data
data = get_weather_data()

# Convert weather data to a Pandas DataFrame
df = pd.DataFrame(data["daily"])

# Format the date column
df["dt"] = pd.to_datetime(df["dt"], unit="s")
df["date"] = df["dt"].dt.date
df = df.set_index("date")

# Create a line chart using Plotly Express
chart = px.line(df, x=df.index, y="temp.day", title="Dortmund Weather Forecast")
chart.update_xaxes(title="Date")
chart.update_yaxes(title="Temperature (°C)")

# Display the chart in the Streamlit app
st.plotly_chart(chart)

```

In general, that's not too bad. ChatGPT also gave some instructions on how to get the API key. Unfortunately, it didn't tell me I also have to install `plotly`, but as I asked for a Streamlit app, it's OK to assume I know how to install libraries.

Nevertheless, there are two issues:

- The temperature value is not parsed correctly. It is saved as a dictionary and accessing it with `y="temp.day"` will throw an error. A quick and easy fix would be to replace this with `y=df['temp'].str['day']`. I assume that's a good example for how the model has learned a lot of different ways how to handle the reply of the API but isn't successful in drawing a connection between parsing the data and accessing it for the chart again.
- The app only works if there is a valid API key and throws an error if there is none. The missing error handling is unfortunate as it displays error messages in the front end. However, it could quickly be fixed by either catching the error and displaying a more user-friendly error message (preferred) or implementing the API call so that the error is not displayed in the UI.

Apart from these issues, the code looks fine and runs after fixing the first issue. Also, while the number of comments might be too ambitious in general, it's helpful to understand the generated code.

{% myImage "./src/assets/images/code-ai3.png", "The streamlit dashboard", "post" %}

### Writing tests with ChatGPT

Next, I asked ChatGPT to write a unit test for the application.

```python
import unittest
from app import get_weather_data

class TestWeatherApp(unittest.TestCase):

    def test_weather_data(self):
        # Call the function to get weather data
        data = get_weather_data()

        # Check that the data contains the expected keys
        self.assertIn("current", data)
        self.assertIn("hourly", data)
        self.assertIn("daily", data)

        # Check that the daily data contains the expected keys
        daily_data = data["daily"][0]
        self.assertIn("dt", daily_data)
        self.assertIn("temp", daily_data)
        self.assertIn("feels_like", daily_data)
        self.assertIn("pressure", daily_data)
        self.assertIn("humidity", daily_data)
        self.assertIn("dew_point", daily_data)
        self.assertIn("wind_speed", daily_data)
        self.assertIn("wind_deg", daily_data)
        self.assertIn("weather", daily_data)
        self.assertIn("clouds", daily_data)
        self.assertIn("pop", daily_data)
        self.assertIn("uvi", daily_data)
```

This one is interesting. First of all, the test calls get_weather_data(), but the API key is defined outside the function. Therefore, it will run without an API key and will always fail. So the test is useless. Apart from that, this is not a unit test but an integration test. It tests if the (external) API returns the correct data. To implement a unit test, expected data should be mocked, so I asked ChatGPT to fix this.

> This is not a unit test but an integration test. Can you fix this?

```python
import unittest
from unittest.mock import patch
from app import get_weather_data

class TestWeatherApp(unittest.TestCase):

    @patch('requests.get')
    def test_get_weather_data(self, mock_get):
        # Set up test data
        expected_data = {'daily': [
            {'dt': 1645808400,
            'temp': {'day': 5.5, 'min': 2.15, 'max': 7.9, 'night': 3.4, 'eve': 7.9, 'morn': 2.15},
            'feels_like': {'day': 0.3, 'night': -3.04, 'eve': 4.06, 'morn': -4.01},
            'pressure': 1028, 'humidity': 51, 'dew_point': -2.57, 'wind_speed': 2.81, 'wind_deg': 194,
            'weather': [{'id': 801, 'main': 'Clouds', 'description': 'few clouds', 'icon': '02d'}],
            'clouds': 16, 'pop': 0, 'uvi': 2.21}],
            'timezone_offset': 3600}

        # Set up mock response from requests.get
        mock_response = type(
                'MockResponse',
                (object,),
                {'json': lambda self: expected_data}
            )
        mock_get.return_value = mock_response

        # Call the function to get weather data
        data = get_weather_data()

        # Check that the function returns the expected data
        self.assertEqual(data, expected_data)

```

This looks much better, but still, I am missing testing for potential error cases, so I asked again:

> Shouldn't the unittest also check if the app crashes in case something unusual happens. For example, if the API is down?

ChatGPT added this part to the code generated earlier:

```python
@patch('requests.get')
    def test_get_weather_data_error(self, mock_get):
        # Set up mock response from requests.get to raise an exception
        mock_get.side_effect = Exception("Connection error")

        # Call the function to get weather data
        with self.assertRaises(Exception):
            data = get_weather_data()

```

This addition looks reasonable. However, as the original app does not handle any error cases, this test doesn't make much sense. Testing if the app doesn't crash when we know it will crash leads nowhere, so I stopped asking.

Overall, the results presented by ChatGPT were OK. They certainly help with prototyping or giving a template to start from. However, the code still needs to be made production-ready. ChatGPT would certainly help with that, but improving the code step by step by asking the right questions is not an efficient way of working.

#### Outlook

Last year, Deepmind's AlphaCode took part in a competitive programming contests and [performed like a median human competitor.](https://www.deepmind.com/blog/competitive-programming-with-alphacode) The code and some comments by a human competitor can be found [here](https://alphacode.deepmind.com/). This has been quite a breakthrough as it was the first time a AI coding model proved problem-solving skills. It will be interesting to see how these models improve and find their way into software development.
