// @ts-ignore
import * as eventComponents from './components/events-components/index.tsx';

const run = async () => {
  const res = await fetch('http://localhost:3001/getRequiredComponents');
  if (!res?.ok) throw new Error('Unable to fetch data, local server running?');

  const data = await res.json();
  /** Events */
  console.log(`\n Logging events... \n`);
  const { events } = data;

  for (const section of events) {
    const { _id, methods } = section;
    for (const method of methods) {
      const key = `${_id}.${method}`;
      let exists = false;
      if (eventComponents?.components?.[key]) {
        exists = true;
      }
      console.log(`${key} => ${exists ? '✅' : '🟥'}`);
    }
  }

  // console.log(`\n Logging extrinsics... \n`)
  // /** Extrinsics */
  // const { extrinsics } = data

  // for (const section of extrinsics) {
  //   const { _id, methods } = section
  //   for (const method of methods) {
  //     const key = `${_id}.${method}`
  //     let exists = false
  //     if (eventComponents?.components?.[key]) {
  //       exists = true
  //     }
  //     console.log(`${key} => ${exists ? "✅" : "🟥"}`)    }
  // }
};

run();
