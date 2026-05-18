# IT-Management Project LagerSync

## Introduction
This document combines all previous tasks for **LagerSync** into one final report. The main idea of the project is to create a digital solution for improving timber transport coordination between private forest owners, SIDG, and transport providers.

# Project charter

This chapter defines the foundation of the LagerSync project. It explains why the project matters, what goals it has, and what limitations, risks, and resources have to be considered before development begins.

## Project name
LagerSync

## Project client
* Client: SIDG (Slovenski Drzavni Gozdovi)
* Project sponsor: ZGS Kocevje (Zavod za Gozdove Slovenije - Kocevje)

## Document version and date of changes made
|Version|Description|Date and time|
|-|-|-|
|1.|Added english version|2.22.2026 5:22 PM|
|2.|Fixed translation|2.22.2026 5:26 PM|


## The importance of the project for the organization and its environment
Less complications for truck drivers, quicker lumber transport, syncronisation and communication between private forest owners

## The purpose and the objectives of the project
Purpose:
* Easier lumber transport organisation
* Less empty trucks -> less emmitions
* cooperation between private forest owners and the country.

Goal:
Create a web application, which would allow private owners of forests or SIDG, to sign up that they have a certain number of logs that need transport, (these would be less than a full truck), the application would then organise this in such a way so that the truck driver would just go from one pile to the other, thus fully filling up his truck, so that it can then be transported to sawmills or abroad, where they are usually sold .This way, the private forest owners and SIDG would get transportation for their lumber.

## Possible requirements of the contracting authority (options):
* Other rules of the organisation:
In the situation of a combined transport of lumber (from both the private owner and SIDG), SIDG chooses where these logs will be sold and in the end SIDG pays out the private owner without taking an additional organisational cut.
* Spatial and working conditions:
In the case of rain, or other unfavorable weather conditions that do not allow the transport of logs, the trucker is given the option to either postpone or cancel the transportation.
* Description of the finished product, service or result:
Web application for synchronization of private land owners and transportation of logs, and further support of the project
* Reporting and final report:
In the end both ZGS and SIDG get the financial report and the final report. Also additional tools are enabled so that they can report problems in the application and comunicate with the developers.

## Project limitations (options):
* Rough schedule
>- We begin in march 2026
>- Project planning has to be confirmed till april 2026
>- A prototype has to be prepared till July 2026
>- The project has to enter the customer testing phase till November 2026
>- Final project relase has to occur till the end of the year 2026
* Available funds
>- ZGS Kocevje (5.000 EUR) + SIDG (150.000 EUR)
>- Necessary funds: 137.500 EUR
(3 * 5000 * 9 = 135000 Employe pay (Untaxed)
Visual studio profesional 500 * 3 -> 1500)
* Phases of project implementation
>- Web application development
>- Creation of a prototype
>- Customer testing
>- Application release
>- Further maintenance
* Partial objectives and results
>- Creation of the project team, purchasing of licenses, organisation of development, acquisition of sponsors
>- Prototype creation
>- Customer testing
>- Final web application release and further maintenance
* Milestones - dates required
>- 1 . July 2026 prototype
>- 5 . November 2026 Customer testing
>- 23 . December 2026 Final release

## Project manager and team, roles and employment
* Tilen Tratnik (89221123) - Team lead, documentation, tasks(33%->Micro guided us, made all of the documentation and made a list of tasks for each person)
* Vid Brloznik (89221178) - Presenter, designer,tasks(33% -> Was the presenter of all of our tasks and designed the web page and helped out with Admin Panel coding)
* Florijan Peric (89231252) - Developer,tasks(33% did the prototype and all of the programming, helped with the documentation)
* All of the Homeworks/Tasks were done together with equal (33%/33%/33% split)

## Risk assessment
>- Time limitations (8)
>- Monetary funds (4)
>- Change of plan or cancelation of project due to changes in government (4)

## Motivation
- Becoming known on the country level

## Date of order
22.2.2026

## Client and signature
SIDG

### Chapter summary
The project charter shows that LagerSync is planned as a response to a real transport coordination problem. After defining the scope, budget, risks, and timeline, the next step is to better understand the people who would use the system.

# Personas

This chapter introduces the main types of users that LagerSync is designed for. By describing their goals, problems, and daily work, we can determine which features have priority.

## Jozko Podlozko
**The Efficient Transporter**

---

## Demographic

- **Age:** 50
- **Gender:** Male
- **Marital Status:** Married
- **Income:** ~45,000 EUR per year (Ballpark)
- **Location:** Southern Slovenia

---
## Function
Independent Timber Truck Driver responsible for transporting logs between private forest owners, SIDG storage facilities, and sawmills.

---
## 3. Screening Question
"How many trucks of lumber do you transport on a weekly basis?"

---

## Lifestyle

Jozko is a 50-year-old independent timber truck driver from Southern Slovenia. He is married and values family life, financial stability, and practical solutions.

He works long hours and usually starts early in the morning. His profitability depends on having a fully loaded truck a. When the truck is only partially filled, his fuel costs remain the same, but his income decreases.

Jozko prefers simple digital tools that save time rather than complicated systems. He is experienced with forest roads and is also a skilled mechanic, which helps him handle technical issues on the road.

In his free time, he enjoys riding motorcycles and farming.

**Values:**
- Efficiency
- Reliability
- Clear communication
- Practical solutions
- Family
- Money

Prefers digital tools that save time rather than complicated systems.

---

## Personality

- **Organized:** High
- **Flexible:** Medium
- **Adventurous:** Medium
- **Cautious:** High
- **Social:** Medium
- **Independent:** High

Jozko is practical, responsible, and solution-oriented.
He prefers clear instructions and predictable schedules.
He is also a good mechanic so he can fix most of the things that break

---

## Goals

- Drive with a fully loaded truck
- Avoid waiting at pickup locations
- Increase monthly profitability
- Minimize paperwork
- Reduce expenses

---

## Challenges

- Partial truck loads reduce profit
- Last-minute cancellations
- Poor coordination between forest owners
- Bad forest roads
- Manual documentation processes
- At times too much work for a day, at times too little

---
##  Needs

- Smart route optimization
- Combined transport planning
- Real-time notifications
- Digital delivery confirmation
- Transparent communication with SIDG and forest owners

---

##  Skills

- **Driving & Logistics:** 95%
- **Navigation Systems:** 85%
- **Digital Tools Usage:** 70%
- **Forest Road Experience:** 90%
- **Problem Solving:** 85%
- **Mechanic:** 90%
---

## Quote

> "If my truck isn't full, I'm losing money. I just need clear routes, ready logs, and no surprises."

### Problem Scenario: Partial Truck Load

Jozko receives a transport order from a private forest owner with only 14 m3 of logs.
A full truck holds 32 m3.

If he accepts:
- He drives with a half-empty truck.
- Fuel costs stay the same.
- Profit is reduced.

If he refuses:
- He risks losing future cooperation.
- The forest owner must wait longer for transport.

#### Alternative with LagerSync
- The system automatically finds nearby timber from SIDG or another private owner.
- Loads are combined to reach full capacity.
- Jozko receives an optimized route.
- Truck is fully loaded -> maximum profitability.
---

### Problem Scenario: Last-Minute Cancellation

Jozko drives 40 km to a pickup location.
When he arrives, the logs are not ready or the forest road is too muddy after rain.

Consequences:
- Wasted fuel
- Lost working hours
- Delayed schedule
- Reduced daily income

#### Alternative with LagerSync
- Forest owners must confirm readiness before pickup.
- Jozko receives real-time notifications.
- He can postpone or reassign the route digitally.

Result:
- Fewer unnecessary trips
- Better time management
- More predictable income

---

## Marjan Mehkohlacnik
**The Impatient Private Forest Owner**

---

## Demographic

- **Age:** 62
- **Gender:** Male
- **Marital Status:** Married
- **Income:** ~50,000 EUR per year (Ballpark)
- **Location:** Southern Slovenia

---

## Function

Private owner of forest land who needs regular timber transport.

---

## 3. Screening Question

"How often are you in need of transport for timber but don't have a reliable way?"

---

## Lifestyle

Marjan is a 62-year-old private forest owner from Kocevje. He is married and values efficiency and a direct approach to life.

Being older, he wants to get the job done quickly, but he lacks access to a fast and reliable way to organize timber transport and usually wastes a lot of time coordinating pickups.

He prefers not to constantly make phone calls or be bothered. As an introvert, he enjoys being alone or spending time with his family.

In his free time, he likes to fish, carve wood, and spend time with his family.

### Values

- Efficiency
- Reliability
- Quick thinking
- Ingenuity
- Family
- Stability

---

## Personality

- **Organized:** Medium
- **Flexible:** High
- **Adventurous:** Low
- **Cautious:** High
- **Social:** Low
- **Independent:** High

---

## Goals

- Have transport available at all times
- Avoid calling people for pickup
- Minimize required work
- Reduce expenses

---

## Challenges

- Calling people for pickup
- Waiting too long for transport
- Paying for a whole truck regardless of load size

---

## Needs

- Quick access to transport
- Feedback from drivers
- Fast access to other forest owners and SIDG
- Ability to transport small quantities of logs

---

## Skills

- **Business:** 80%
- **Tree Felling:** 95%
- **Digital Tools Usage:** 50%
- **Fast Thinking:** 90%
- **Strong-Minded:** 80%

---

## Quote

> "I only have a few logs, but they are taking up space. I don't want to pay for a full truck."

---

## Problem Scenario: Small Load

Marjan only wants to transport 10 m3 of logs.

### If he orders transport:

- He is wasting money
- He is causing issues for the driver
- Profit is reduced

### If he waits for more trees to be cut down:

- The wood might degrade
- Storage space is wasted

### Alternative with LagerSync

- The system automatically finds nearby drivers who aren't driving full trucks
- He adds his load to others
- Marjan doesn't waste money on a whole truck
- He can have logs transported at any time without worry

---

## Problem Scenario: Wish for Documentation

Marjan wants to keep documentation of previous transports.

### If he does it manually:

- He loses valuable time that could be spent elsewhere
- He needs to manually input all details
- Paperwork and transport documentation become messy

### If he doesn't do it:

- He might forget important details
- He might lose driver information

### Alternative with LagerSync

- All details of previous orders are saved in the app
- Documentation is easily accessible
- Marjan doesn't lose time writing down details


- All details of previous orders are saved in the app
- Documentation is easily accessible

- Marjan doesn't lose time writing down details

## Zlatko Grm
**The Stressed Shipper**

---

## Demographic

- **Age:** 27
- **Gender:** Male
- **Marital Status:** Single
- **Income:** ~24,000 EUR per year (Ballpark)
- **Location:** Southern Slovenia

---
## Function
SIDG employed shipper tasked with supervising and organizing log transport, messuring logs, and ensuring proper handling, he is also tasked with public outreach in regards to purchasing private land.

---
## 3. Screening Question
"How much time do you spend organising log transport and contacting private land owners daily?"

---

## Lifestyle

Zlatko is a 27-year-old shipper employed by SIDG. He is single and drives to logging sites daily from Ribnica. He has been working for SIDG for about 4 years now and he has worked there since he got out of college.

He is constantly under pressure from supperiors, since he has to constantly deliver more and more logs to the sawmills, and because the ZGS does not allow clear-cutting, he has to reach out to private forest owners, if they would be willing to sell their land to SIDG. When the trucks are half full, he has to hear from supperiors, and is under a lot of stress.

He has to stay late a lot, since he has to wait for logging trucks to get to the logging site and finish loading.

Zlatko wants a simple system so that he can come into work, do his job and clock out as soon as possible.

In his free time, he likes hiking and meeting new people.

**Values:**
- Simplicity
- Easy communication
- Practical solutions
- Free time
- Money

Prefers digital tools that save time rather than complicated systems.

---

## Personality

- **Organized:** Low
- **Flexible:** High
- **Adventurous:** High
- **Cautious:** Low
- **Social:** High
- **Independent:** Medium

Zlatko is a bit unorganized but he is willing to try everything at least once.
He loves technology and loves learning new things.
He is very good at sales, and is generaly loved by everyone he works with.

---

## Goals

- Better outreach to private land owners
- Better organization -> Less stress
- Avoid waiting at pickup locations
- Less necessary overtime -> More free time

---

## Challenges

- Poor coordination between lumberjacking groups
- Managing many pickup locations
- Hard to contact private land owners
- Enforced overtime

---
##  Needs

- Smart route optimization
- Combined transport planning
- Real-time notifications
- Digital delivery confirmation
- Simple way to contact private land owners

---

##  Skills

- **Logistics & organization:** 60%
- **Navigation Systems:** 85%
- **Digital Tools Usage:** 90%
- **People skills:** 90%
- **Problem Solving:** 90%
---

## Quote

> "I just want to finish this, and go hiking!"

### Problem Scenario: Missing Truck

Zlatko has arranged to have 32 m3 of logs picked up by a private contractor, but he has been waiting for 30 minutes now, and the truck driver has not showed up yet, despite calling him.

If he continues waiting:
- He could be just standing there for hours, with no additional pay, and the truck might not even show up.
- If the truck shows up, the truck driver can always say that for instance 8m3 of logs are not a high enough grade, and that he wont be loading cellulose.
- 1/4 of the day is wasted.

If he goes home:
- He will hear from both his supperiors and the truck driver if the truck showed up.

#### Alternative with LagerSync
- The system automatically displays the driver location so he can estimate how soon the truck will show up, this way if he sees the truck standing in the same spot for a long time he can guess that the driver got a flat tire or is getting weighed by the police.
- Since he sees the location of the truck driver, he can also just drive there if it is close by, if he can not get ahold of the driver.

### Chapter summary
The personas show that LagerSync has to balance three different perspectives: profitability for drivers, simplicity for private forest owners, and coordination for SIDG employees. These insights lead into the user stories, where those needs are turned into functional requirements.

---

# User stories

This chapter turns the personas into more concrete requirements. Each user story shows what a user wants from the system and why that feature would help them.

**Jozko Podlozko**

As a truck driver I want to have a way to know what other loads are in the area, that are looking for transport. So that I always have a fallback if a load gets canceled.

As a truck driver I want to have the ability to filter loads by quality and size, this would make it much simpler for me if I have a 1/2 full truck of celulose and want to load only celulose, so I dont have to drive this to two locations.

As a truck driver I want to have a way for customers to see my loaction, so that I do not get pestered by their phone calls unnecessarly.

**Marjan Mehkohlacnik**

As a private forest owner I want to specify when the logs can be picked up, since if it has rained, I do not want big trucks ruining the skid trail or the forest road.

As a private forest owner I want a way to see the price the truck driver is offering to buy off my logs, since I do not lowballing.

As a private forest owner I want a way to cancle a truck pickup if I see that the truck driver is offering a too low price, I know what I got.

As a private forest owner I want to be notified when the truck will arive so that I can be present and make sure I am not getting ripped off.

**Zlatko Grm**

As a shipper, I want a reliable way to organize and log all my transport logs, receipts and measurements, since I have to show this to my higher ups.

As a shipper, I want a reliable way to contact the private land owners, since the company wants to buy them out, for their forest.

As a shipper, I want to see a schedule of all the transports I have organized daily, so that I know where to be and when.

### Chapter summary
The user stories turn the personas into specific feature expectations and give the project a clearer direction. With these needs defined, the next step is to test whether these assumptions are supported by real users.

# Hypothesis Testing

This chapter checks whether the core problem identified by the project is actually experienced by potential users. Through simple interviews, the project tests whether there is real interest in a tool like LagerSync.

## Interview questions

**1.** Do you own any forest plots?

**2.** Do you have any problems organising log transport?

**3.** Do you wish there was a way to automate this process?

## Interview number 1

**Person interviewed** Nal, a 22 year old student that owns a truck and has a private logging buisness.

### Answers

**1.** No, I transport logs for *umm...* personal use

**2.** Yes, it takes me a lot of time and effort to organise everything and in the end not get noticed.

**3.** Yes, although, I dont really like the part where the private forest plot owners can monitor my location and pricing.

### Conclusion

There is a demand for organised log transport, also what should be kept in mind is that some people do not want to share their location and pricing.


## Interview number 2

**Person interviewed** Robert Sen, a 23 year old college dropout with about 10 ha of forest plots.

### Answers

**1.** Yes, I inherited a majority of it from my brothers grandpa in his will.

**2.** Yes, my truck driver refuses to go by the books and is lowballing me.

**3.** Yes, that would save me a lot of time and money, also it would be a lot more legal.

### Conclusion

There is a demand for organised log transport.


## Interview number 3

**Person interviewed** Jan, a 67 year old largescale forest plot owner, owning about 84 ha.

### Answers

**1.** Yes, I bought it for cents on the dollar from old people/people that inherited forests and lived in cities.

**2.** Yes, I used to have a guy for this, but now he is retired.

**3.** Yes, although I like talking to people, since you usually get a better deal if you know them.

### Conclusion

There is a demand for organised log transport. Some people also want the option to communicate with the drivers.

### Chapter summary
The interviews support the basic idea behind LagerSync and confirm that the transport problem is real. They also show practical concerns such as privacy, trust, and communication, which makes usability testing the next important step.

# LagerSync – Usability Testing

This chapter focuses on how users interact with the prototype itself. While the interviews tested the project idea, the usability session checks whether users can use the application interface and complete key tasks without major problems.

## Session Design

### Intro
Thank you for taking part in our study. This session is about testing **LagerSync**, a web application for organizing lumber transport.

- You will complete a few tasks
- Think out loud while using the app
- There are no wrong answers
- Session duration: ~10 minutes

---

## Preparation

Before each test:
- Clear local cache (LocalStorage)
- Pre-create 4-5 log loads:
  - Some from **Sodrazica**
  - Different dates (include April 5th)
  - Different volumes (some above and below 7 m3)

---

## Test Tasks

| # | Task | Estimated Time | Notes |
|--|------|----------------|------|
| 1 | Register and Login | 1-2 min | Evaluate account flow |
| 2 | Filter loads (Sodrazica, April 5th, >=7 m3) | 2 min | Evaluate filtering usability |
| 3 | Add a new log transport request | 2 min | Evaluate form usability |
| 4 | Accept a transport request | 1 min | Evaluate interaction |

---

## Testing Results

### User 1
- Login: 1 min
- Filter: 2 min (needed help)
- Add logs: 1 min
- Accept: 20 sec

**Notes:**
- Filtering confusing
- Checkbox unclear

---

### User 2
- Login: 40 sec
- Filter: 1 min
- Add logs: 40 sec
- Accept: 10 sec

**Notes:**
- Smooth experience
- Suggested better filter UI

---

### User 3
- Login: 1 min 20 sec
- Filter: 2 min 30 sec (struggled)
- Add logs: 1 min 30 sec
- Accept: 30 sec

**Notes:**
- Didn't understand filters well
- Confused by m3

---

## Findings

### Issues
- Filtering system is unclear
- Units (m3) confusing for some users
- Checkbox for acceptance not obvious

---

### Improvements Needed
- Add clearer filter UI
- Add tooltips/help text
- Improve navigation
- Add confirmation messages

---

## Conclusion

The system works but needs improvements in:
- Filtering usability
- User guidance
- Input clarity

With improvements, LagerSync could be a practical solution for real-world use.

### Chapter summary
The usability results show that the idea is promising, but the interface still needs improvements before real deployment. These findings help guide the next chapter, which outlines how the full solution should be implemented.

# LagerSync - Planned Implementation of the Solution

This chapter explains how the insights from the earlier research and testing can be turned into a practical software solution. It outlines the expected features, technologies, pages, and data structure of the application.

## Project Description
LagerSync is a web application designed to improve lumber transport organization between private forest owners, SIDG, and truck drivers. The goal is to reduce empty truck trips, improve communication, and make transport more efficient.

---

## Planned Features

### User Registration and Login
Users will be able to create accounts and log in.

User roles:
- Private Forest Owner
- SIDG Representative
- Truck Driver
- Administrator

### Add Logs for Transport
Users can add a transport request with:
- Owner type
- Location
- Volume of logs
- Pickup date
- Destination

### Dashboard of Available Loads
The dashboard will show all available transport requests.

Users will be able to:
- View all loads
- Search by location
- Filter by date
- Filter by minimum volume

### Accept Transport Requests
Truck drivers can accept transport jobs.

The system will:
- Mark accepted loads
- Prevent multiple users from accepting the same transport
- Store the name of the accepted driver

### Messaging System
Users will be able to communicate with each other through an internal messaging page.

The messaging system will help with:
- Pickup coordination
- Questions about delivery
- Communication between SIDG, truck drivers, and forest owners

### Reports and Feedback
Administrators and SIDG will be able to:
- Review transport activity
- Export reports
- Receive bug reports
- Receive user feedback

---

## Planned Pages

| Page | Purpose |
|------|---------|
| index.html | Dashboard with available loads |
| add.html | Add transport requests |
| accept.html | Accept transport jobs |
| messages.html | User communication |
| login.html | User login |
| register.html | User registration |
| chat.html | Communication between users |
| admin.html | Admin tools |

---

## Technologies and Tools

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Design and Planning Tools
- Figma
- Canva
- Draw.io
- Inkscape

### Development Tools
- Visual Studio Code
- GitHub
- LocalStorage (for prototype testing)
- Jira

---

## Database Structure

The system will contain the following database tables:

### Users Table
Stores:
- Username
- Email
- Password
- User role

### Logs Table
Stores:
- Owner type
- Location
- Volume
- Pickup date
- Status
- Accepted driver

### Messages Table
Stores:
- Sender
- Receiver
- Message content
- Date and time

---

## Team Roles

| Team Member | Role |
|------------|------|
| Tilen Tratnik | Team lead, Documentation, Tasks |
| Florijan Peric | Developer |
| Vid Brloznik | Presenter / UI |

### Chapter summary
The planned implementation shows that LagerSync is not only a concept, but also a technically realistic application with a clear feature set and development direction. Before concluding the project, it is still important to consider the people and organizations that influence its success.

# Project stakeholders

This chapter identifies the key groups connected to the project and explains what they expect, what they gain, and where conflicts may appear. Understanding these relationships is important for both adoption and long-term success.

|**Name of the stakeholder**|**Status**|**Expectations**|**Benefits & Conflicts**|**Team response**|
|-|-|-|-|-|
|Private forest owner|**+**|Expects a simple and understandable application that allows them to order log transport at their convenience|**Benefits:** Simple log transport orders, realtime location of the driver, easy communication with the driver. **Conflicts:** If the communication aspect is lacking people will switch to alternatives. | Regular updates, simple update notes, responsivnes to customer support questions.
|SIDG Employe|**-**|Expect an application that makes their job easier, they are more demanding than private forest owners, the application has to function well with their pre existing applications.|**Benefits:** Simpler communication with private land owners, easier way to reach them in case of problems, being at ease because of the fact that they can see where the truck is currently located. **Conflicts:** If there are any problems they will swich back to the previous way of operating with ease.|Regular updates, allowed input on application development, responsivnes to requests.
|Truck driver|**o**|Expect an application that improves the way they conduct business.|**Benefits:** Easier communication with clients, less anoying phone calls because the clients will know where they are, a way to organise pickup combinations with more than one client. **Conflicts:** Live location sharing is a bit of an invasion of privacy, Truck drivers have their routes and regular customers already figured out, so they could live without this, but they would be losing a bit of extra profit.|Regular updates, responsivnes to requests.
|Investor|**+**|Expect that their investment will turn a profit. They might worry about deadlines and development progress.|**Benefits:** More money for funding application development. **Conflicts:** Higher pressure with deadlines and more pressure to create a profit quickly.|Regular updates, regular financial reports, proof that the investor will make a return on investment

### Chapter summary
The stakeholder analysis shows that LagerSync must succeed not only as software, but also as a cooperative project between users, institutions, and investors. That makes teamwork and management practices especially important, which is the focus of the next chapter.

# Engineering Management

This chapter reflects on how the team should work during the project. Good planning and a strong idea are not enough on their own, so engineering management helps make sure that the team can deliver the solution effectively.
The outlined patterns reflect our previous problems and how we will avoid them in the future.

## Positive Pattern

### Be a Teacher and a Mentor
We would apply this by helping teammates not only by providing answers, but also by explaining the concepts behind them.

For example, when a teammate has a problem with Git branching, instead of just fixing the issue myself, I would explain how the problem occurred, how to avoid such conflicts in the future, and how to properly use rebasing. This helps the whole team improve, not just solve one problem.

### Setting clear goals
In our project we tried to set as clear goals as possible, we tried to predefine the entire project in advance so there are no suprises at the end.

We did this by definig all features in jira so that as we develop the program we have a clear indicator of progress.

---

## Antipatterns and How We Would Avoid Them

### Treat Your Team Like Children
In our project, I would avoid this by treating everyone as a responsible contributor. At the end of the day, we all share the same grade and have the same goal-to successfully complete the class.

Instead of controlling every step, we would trust each other to complete assigned tasks and only step in when help is needed. This creates a more respectful and productive team environment.

---

### Ignore Human Issues
In our project, we would not ignore human issues. If someone does not have time in a certain week or has real-life problems, we would be understanding, since this can happen to anyone.

We would communicate openly about availability and adjust tasks if needed, so that the workload stays balanced and no one feels overwhelmed. This helps maintain both team morale and productivity.

### Chapter summary
The engineering management chapter shows that LagerSync depends not only on features and planning, but also on trust, communication, and teamwork. These points lead into the final conclusions of the whole project.

# Conclusions

LagerSync addresses a clear and realistic problem in timber transport organization. The earlier chapters show that truck drivers, private forest owners, and SIDG employees all face coordination problems that reduce efficiency, increase stress, and create unnecessary costs. Because of that, the project has clear practical value.

The personas and user stories show that the system has to support different types of users with different expectations, while the interviews confirm that there is real interest in a solution that simplifies transport organization. The usability testing then shows that the concept works, but that the interface still needs improvements in areas such as filtering, guidance, and clarity.

The implementation chapter shows that LagerSync can be developed as a realistic web application with defined features, and structured database design. At the same time, the stakeholder and engineering management chapters show that project success also depends on communication, trust, and responsiveness toward both users and team members.

Overall, LagerSync has strong potential to become a useful digital platform for timber transport coordination. If the project stays aligned with the user needs, it could provide both operational and organizational benefits in real-world forestry logistics.
