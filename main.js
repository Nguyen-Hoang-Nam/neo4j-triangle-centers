import { driver, auth } from "neo4j-driver";
import { parseHtml } from "./crawl.js";
import { store } from "./neo4j.js";
import * as dotenv from "dotenv";
dotenv.config();

const connection = driver(
    process.env.NEO4J_CONNECTION_STRING,
    auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = connection.session();

try {
    const data = await parseHtml();

    await store(session, data);
} finally {
    await session.close();
}

await connection.close();
