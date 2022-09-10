import { getPointName, getProperties } from "./parse/encyclopedia.js";
import neo4j from "neo4j-driver";

const store = async (session, data) => {
    const length = data[0].length;
    for (let i = 0; i < length; i++) {
        const [number, name] = getPointName(data[0][i]["name"]);
        const properties = getProperties(data[0][i]["property"]);

        const result = await session.run(
            "match (c:Center {id: $id}) return c",
            {
                id: number,
            }
        );

        if (result.records.length == 0) {
            await session.run("CREATE (c:Center {id: $id, name: $name})", {
                id: neo4j.int(number),
                name: name,
            });
        } else {
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            if (!node.properties.name) {
                await session.run(
                    "match (c:Center {id: $id}) set c.name = $name",
                    {
                        id: number,
                        name: name,
                    }
                );
            }
        }

        for (let j = 0; j < properties.length; j++) {
            await existOrCreate(session, properties[j].node2);

            let relative = await session.run(
                "match (a:Center {id: $node1})-[r]-(b:Center {id: $node2}) return r",
                {
                    node1: number,
                    node2: properties[j].node2,
                }
            );

            if (relative.records.length == 0) {
                await session.run(
                    "match (a:Center), (b:Center) where a.id = $node1 and b.id = $node2 create (a)-[r:Relation {name: $name}]->(b)",
                    {
                        node1: number,
                        node2: properties[j].node2,
                        name: properties[j].relative,
                    }
                );
            }
        }
    }
};

const existOrCreate = async (session, number) => {
    let result = await session.run("match (c:Center {id: $id}) return c", {
        id: number,
    });

    if (result.records.length == 0) {
        result = await session.run("CREATE (c:Center {id: $id}) return c", {
            id: neo4j.int(number),
        });
    }
};

export { store };
