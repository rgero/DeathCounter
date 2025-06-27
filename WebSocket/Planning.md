# Planning
## Goal
The goal is to make a Websocket server that a user can connect to from the React Front End and from the Key Listener. I want to be able to have their instance of the Front End connect and listen to the same channel/events that the Key Listener is on.

### Requirements
- The user should have the ability to connect to the server and join a channel by providing the channel ID and the authentication token
	- How does the user get this authentication token?
		- The Front End should provide it to them. This does mean that there will need to be an event where the Front End asks the server to generate a key and stores the response. This means that there should be a secondary key that is exclusively used for that route.
- The user should be able to emit an "increment death" event to the server
- The user should be able to emit a "decrement death" event to the server.
- The user should be able to emit a "conquered" event to the server.
- All events should have a key corresponding to them.
- If the verification of the key is successful, the server should emit the event to the larger audience.

### Thoughts on Payload
Let's keep the payload simple. There's no reason to store anything corresponding to the user since that will be handled by the Front End.
```
{
	event: string,
	authenticationKey: string
}
```

### Things to consider
- What is the thing that communicates to Supabase?
	- The Front End. It'll listen for the events and when it processes the event it will handle the communication to Supabase.
