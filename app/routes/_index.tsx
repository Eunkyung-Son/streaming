import type { MetaFunction } from "@remix-run/node";
import pkg from "react-dom/server";
const { renderToReadableStream } = pkg;
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My app</title>
      </head>
      <body>
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i}>{i}</div>
        ))}
      </body>
    </html>
  );
}

export default function Index() {
  const decoder = new TextDecoder();

  async function readStream(stream: ReadableStream<Uint8Array>): Promise<void> {
    const reader = stream.getReader();

    async function processChunk(
      result: ReadableStreamReadResult<Uint8Array>
    ): Promise<void> {
      if (result.done) return;

      if (result.value) {
        const decodedValue = decoder.decode(result.value);
        console.log(decodedValue);
      }

      return reader.read().then(processChunk);
    }

    return reader.read().then(processChunk);
  }

  async function fetchAndProcessStream(): Promise<void> {
    const stream = await renderToReadableStream(<App />);
    await readStream(stream);
  }

  fetchAndProcessStream().catch(console.error);

  return <div>Index Component</div>;
}
