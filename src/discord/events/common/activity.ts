import { Event } from "#base";

new Event({
    name: "status",
    event: "ready",
    async run(client) {

        client.user.setActivity("Beta");

    }
    
});