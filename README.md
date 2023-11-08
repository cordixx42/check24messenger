# check24messenger

messenger for check24 challenge

CURRENT IMPLEMENTATION

frontend
ReactJS

backend
NodeJS

database
MongoDB

WEBSOCKETS used for real-time communication => messages
-> each client/user one websocket to send messages to server

rest api for identification and fetching conversations

implementation detail REVIEW
-> added field review and accepted-at to DB
->

implementation detail attachments

FUTURE TODOS
can conversation switch from "accepted" or "rejected" back to "quoted" ?
-> same provider offers a new quote to same customer, new conversation or not ?

-> size limitations for attachments under 1 mb

-> creation of new conversations

-> masking better regular expressions

-> login system with creation of new users
