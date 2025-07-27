import { Hono } from "hono";
import { faker } from "@faker-js/faker";
import _ from "lodash";
import { z } from "zod";

const route = new Hono();

const vehicles = Array.from({ length: 100 }, (_, i) => {
    return {
        id: i + 1,
        uuid: faker.string.uuid(),
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.date.past({ years: 20 }).getFullYear(),
        color: faker.vehicle.color(),
        licensePlate: faker.vehicle.vrm(),
        vin: faker.vehicle.vin(),
        fuel: faker.vehicle.fuel(),
        transmission: faker.helpers.arrayElement(["Automatic", "Manual"]),
        vehicle: faker.vehicle.vehicle(),
        type: faker.vehicle.type(),
        owner: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
        },
        mileage: faker.number.int({ min: 1000, max: 200000 }),
        serviceHistory: Array.from(
            { length: faker.number.int({ min: 1, max: 5 }) },
            () => ({
                date: faker.date.past().toISOString(),
                description: faker.lorem.sentence(),
                cost: faker.commerce.price(),
            })
        ),
        features: faker.helpers.arrayElements(
            [
                "Air Conditioning",
                "Navigation System",
                "Bluetooth",
                "Backup Camera",
                "Leather Seats",
                "Sunroof",
                "Remote Start",
                "Blind Spot Monitoring",
            ],
            faker.number.int({ min: 3, max: 7 })
        ),
        images: Array.from(
            { length: faker.number.int({ min: 1, max: 5 }) },
            () => faker.image.url()
        ),
        description: faker.lorem.paragraph(),
        price: faker.commerce.price({ min: 5000, max: 50000 }),
        availability: faker.datatype.boolean(),
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
    };
});

const vehicleSnippetSchema = z.object({
    id: z.number(),
    uuid: z.string(),
    make: z.string(),
    model: z.string(),
    year: z.number(),
    color: z.string(),
    licensePlate: z.string(),
    vin: z.string(),
    fuel: z.string(),
    transmission: z.string(),
    vehicle: z.string(),
    type: z.string(),
    mileage: z.number(),
    features: z.array(z.string()),
    images: z.array(z.string()),
    description: z.string(),
    price: z.string(),
    availability: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

route.get("/", (c) => {
    let pages = Math.ceil(vehicles.length / 20);
    let page = parseInt(c.req.query("page") || "1");
    let offset = (page - 1) * 20;

    if (isNaN(page) || page < 1 || page > pages) {
        page = 1;
    }

    let paginated = vehicles.slice(offset, offset + 20);

    if (paginated.length === 0) {
        return c.json({ message: "No vehicles found for this page." }, 404);
    }

    let response = z.array(vehicleSnippetSchema).safeParse(paginated);

    if (response.error) {
        console.error(response.error);
    }

    return c.json(response.success ? response.data : [], 200);
});

export default route;
