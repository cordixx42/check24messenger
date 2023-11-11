# Web Messenger for the Check24 Coding Challenge

## OVERALL STRUCTURE

Frontend: ReactJs
Three main views: ChatOverview, Chat, Message
ChatOverview shows a navigation bar with the chats on the left, and the individual chats on the right
Message shows the part of the chat displaying all the messages

Three minor views: UserIdentification, DefaultView, NotFound
UserIdentification as a very simple login page, DefaultView as a simple welcome page and NotFound, if user does not exist

Backend: NodeJs with ExpressJs
A monolithic server, offering services to manipulate the conversations and messages

Database: MongoDB
non-relational database, efficient horizontal scalability

Communication: SocketIO in frontend and backend
Websockets are used in order to enable responsive real-time communication
Once a client is on the web messenger, a client-side websocket is created and connects to the server-side websocket
After the connection is established, the client sends his user name to the server
The server manages a socket dictionary mapping currently active users to their socket ids

## SOME IMPLEMENTATION DETAILS

Reviews
-> added field review and accepted_at to conversation

--> review = -1 => service provider has not requested review yet
--> review = 0 => service provider requested review but customer has not answered yet
--> 1 >= review <= 5 => score which customer answered with

--> accepted_at is needed to calculate if the quote has been accepted more than 7 days

-> added new message types review_request and review_answer

--> once review_answer exists, review_request can be blended out

Attachments
-> added field base64 to message
-> the pdf or image file is translated to base64 and persisted in the database

Unread Banner
-> added field was_read to message
-> show banner between first case where previous message from other user was_read = 1 but the message thereafter was_read = 0
-> remember all the new unread messages and update was_read in those messages

Pagination
-> in backend a variable pageLimit can be set, to control how many messages are fetched for one page

## FUTURE TODOS AND OPTIMIZATIONS

-> Login system with creation of new users and authentication
-> Creation of new conversations
-> Redesign dataset structure
-> Showing when messages were read (using read_at field)
-> Currently: only attachments under 1 MB possible, allow bigger attachment sizes, video attachments
-> conversations switching from "accepted" or "rejected" back to "quoted"

## SCREENCAST

https://drive.google.com/drive/folders/1c7W-JUCgIPOp6gqfO37pZ17d-hzmAXuM?usp=sharing

5 Scenarios
-> accept: customer and service provider from login to quote offer to accepting the quote
-> reject: customer rejects a quote offer
-> review: service provider requests review, customer answers review
-> unread: unread banner behaviour
-> pagination: example with pageLimit = 20
