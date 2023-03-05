---
title: 'From Data Science to Data Engineering'
date: 2022-12-28
dateUpdated: 2023-02-08
tags: ['data science', 'data engineering', 'career']
---

After over four years as a Data Scientist, I decided to dive into Data Engineering and ultimately became a Data Engineer. I will explain more about the reason behind that in a separate post. This post will focus on sharing resources I considered explicitly helpful.

There is no such thing as a typical Data Scientist, so writing a step-by-step guide on what to do to switch from Science to engineering wouldn't make much sense. However, there are some resources that I found specifically helpful, so I'd like to share them.

## Prequel

I have worked as a professional Full-Stack Developer for about a year and also did some system administration tasks as a working student. Therefore, I know Linux and how to use the command line. If you don't, that's certainly something to learn.

### Linux and Bash

[The Linux Command Line Bootcamp](https://www.udemy.com/course/the-linux-command-line-bootcamp/learn/lecture/26371502?start=0#overview) by Colt Steele. It is 16 hours long, which might sound scary initially, but it's convenient to watch and entertaining. The course is well structured and you can easily skip parts if you consider topics less relevant (you can definitely skip the chapter about Nano and use vim instead 😉).

## General

#### Fundamentals of Data Engineering (FDE) by Joe Reis and Matt Housley ([O'Reilly](https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/))

Although this was published only a few months ago, it has already become a fundamental resource about everything you need to know about Data Engineering.

The book gives you a very concise overview about the Data Engineering landscapes and does a great job in structuring tasks, technologies, and processes. It only touches on specific technologies, but focuses on the wider concepts.

I have read that some recommend reading FDE before DDIA (see below), but I disagree. It's rather up to your preference and experience. DDIA requires a lot of general knowledge about engineering. But if you have that, it also makes perfect sense to start with DDIA to get a deep understanding of the technology and then map this to the fundamental concepts with FDE.

#### Designing Data-Intensive Applications (DDIA) by Martin Kleppmann ([O'Reilly](https://learning.oreilly.com/library/view/-/9781491903063/))

Designing Data-Intensive Applications (also known as DDIA) has one big disadvantage: you might feel demoralized after realizing that you know much less than you thought you would know. However, this book is motivating at the same time as it explains everything in a relatively simple and understandable way. It's certainly a challenging read, though.

I read the book once, from the very first to the last page, which took me more than one month. You can certainly do this much faster, but so many details caught my attention and motivated me to do more research on specific topics.

## Data Bases and Data Modeling

### Data Warehouses

- The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling by Ralph Kimball [(Wiley)](https://www.wiley.com/en-us/The+Data+Warehouse+Toolkit:+The+Definitive+Guide+to+Dimensional+Modeling,+3rd+Edition-p-9781118530801)

This book is in its 3rd edition of 2013. That's a long time for most tech topics, but this book gives a great overview of Data Warehousing and dimensional modeling. Reading the first two chapters will already give you a good understanding of the fundamental concepts.

### Relational databases and SQL

Relational databases are a fundamental part of most data solutions. Understanding the basics is undoubtedly an essential skill. You can find a lot about this in the DDIA book mentioned above.

Apart from that, it's helpful to practice SQL. It doesn't matter much whether you use PostgreSQL, MySQL or any other relational database, but you should be familiar with the basics like `select, where, join, group by` and `having`. After that, CTEs (common table expressions) and window functions will also be helpful.

## Solving tasks and structuring problems

At least in Germany, coding interviews are not very popular and so are websites like [Leetcode](https://www.leetcode.com) that help you practice for those interviews.

However, in my experience, they teach you helpful skills. I often struggled to solve simple tasks quickly. Writing some fancy algorithms to solve some unique problems? Sure! Writing three lines of code to do something with a dictionary? Eh, yes, I am sure there is an easy way, let me google that ....

Doing some of the fundamental Leetcode problems has undoubtedly helped a lot, especially the ones about data structures (for example, [arrays](https://leetcode.com/tag/array/)) and [75 problems](https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions), so I recommend doing some of them from time to time. It's even a nice habit you can start: when I was preparing for my new job, I solved at least one task in the morning.

## Architecture and design

Architecture and design are pretty difficult to cover without real use cases. While some recommend doing many projects, I believe this is not an efficient way to spend your time. Especially when you have not much experience, setting up a project takes a lot of time and debugging takes even more.

If that is something that motivates you, go ahead. If it doesn't, I rather recommend doing 1 or 2 example projects to understand the basics. You can start by implementing typical data solution architectures like setting up a dashboard and a database with Docker and then adding a pipeline tool like [Apache Airflow](https://airflow.apache.org/) or [Dagster](https://dagster.io/) to fill the database with simulated data.

### System design

[ByteByteGo](https://bytebytego.com/) has some nice examples of [system design and scaling](https://bytebytego.com/courses/system-design-interview/scale-from-zero-to-millions-of-users). If you have a deeper interest in this topic, you can buy an annual pass to access all content, but the free parts should already be enough.

### Docker and Kubernetes

- [Docker Tutorial for Beginners](https://youtu.be/3c-iBn73dDE) by TechWorld with Nana: free course on YouTube that teaches the basic concepts of Docker.
- [Kubernetes Tutorial for Beginners](https://youtu.be/X48VuDVv0do)as before, a free course by Nana, but this one is about Kubernetes.
- [Docker & Kubernetes: The Practical Guide](https://www.udemy.com/course/docker-kubernetes-the-practical-guide/) by Academind: this is a 23 hours course that covers all the basics. If you have already used Docker, you can skip to the Kubernetes part, but there might also be some "good to know"-parts before that. It doesn't have a steep learning curve, so it's pretty relaxing to watch (if you can say that about a course).

## Pipelines and Tools

Often, data transactions in data engineering is done with pipelines. Understanding how to use pipelines and also why they are used will certainly be very helpful.

- Understanding DAGs and why they are useful ([nice article by astronomer.io](https://www.astronomer.io/blog/what-exactly-is-a-dag/))
- Implement a small project that copies data from one resource to another and does some basic transitions. [Apache Airflow](https://airflow.apache.org/) is probably the most popular data pipelining tool at the time of writing. There are many more, though and most of them follow similar ideas, so it matters little which tool you use.
