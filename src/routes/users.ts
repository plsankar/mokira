import { Hono } from "hono";
import { faker } from "@faker-js/faker";
import _ from "lodash";

const route = new Hono();

const users = Array.from({ length: 100 }, (_, i) => {
    const fullName = faker.person.fullName();
    return {
        id: i + 1,
        uuid: faker.string.uuid(),
        name: fullName,
        email: faker.internet.email({
            firstName: fullName.split(" ")[0],
            lastName: fullName.split(" ")[1],
        }),
        address: {
            street: faker.location.street(),
            city: faker.location.city(),
            state: faker.location.state(),
            zip: faker.location.zipCode(),
            country: faker.location.country(),
            geo: {
                lat: faker.location.latitude(),
                lng: faker.location.longitude(),
            },
        },
        avatar: faker.image.avatar(),
        bio: faker.lorem.sentence(),
        location: faker.location.city(),
        website: faker.internet.url(),
        phone: faker.phone.number(),
        company: {
            name: faker.company.name(),
            occupation: faker.person.jobTitle(),
        },
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
    };
});

route.get("/", (c) => {
    let pages = Math.ceil(users.length / 20);
    let page = parseInt(c.req.query("page") || "1");
    let offset = (page - 1) * 20;
    if (isNaN(page) || page < 1 || page > pages) {
        page = 1;
    }
    let paginatedUsers = users.slice(offset, offset + 20);
    return c.json(paginatedUsers);
});

export default route;
