import { getPointName } from "./parse/encyclopedia.js";

const store = async (session, data) => {
    const length = data[0].length;
    for (let i = 0; i < length; i++) {
        const [number, name] = getPointName(data[0][`${i}`]);

        const result = await session.run(
            "match (c:Center {id: $id}) return c",
            {
                id: number,
            }
        );

        if (result.records.length == 0) {
            await session.run("CREATE (c:Center {id: $id, name: $name})", {
                id: number,
                name: name,
            });
        }
    }

    // const singleRecord = result.records[0];
    // const node = singleRecord.get(0);
    // console.log(node.properties.name);
};

export { store };
