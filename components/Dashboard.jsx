import { getCollection } from "../lib/db";
import { ObjectId } from "mongodb";

async function getHaikus(id) {
  const collection = await getCollection("haikus");
  const results = await collection
    .find({ author: ObjectId.createFromHexString(id) })
    .sort()
    .toArray();

  return results;
}

export default async function Dashboard(props) {
  const haikus = await getHaikus(props.user.userId);

  return (
    <>
      <h2 className="text-center text-2xl text-gray-600 mb-5">
        Your haikus
        {haikus.map((haiku, index) => (
          <div key={index}>
            <p>{haiku.line1}</p>
            <p>{haiku.line2}</p>
            <p>{haiku.line3}</p>
          </div>
        ))}
      </h2>
    </>
  );
}
