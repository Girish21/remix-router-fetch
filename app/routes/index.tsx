import {
  LinksFunction,
  MetaFunction,
  LoaderFunction,
  useRouteData,
  json,
  HeadersFunction,
} from "remix";
import { Navbar } from "../components/nav/navbar";
import stylesUrl from "../styles/index.css";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") || "max-age: 0",
  };
};

export const loader: LoaderFunction = async () => {
  const res = await fetch("https://api.github.com/gists");
  const data = await res.json();

  return json(data, {
    headers: { "Cache-Control": "max-age=300" },
  });
};

export default function Index() {
  const data = useRouteData();

  return (
    <>
      <Navbar />
      <h2>Public Gists</h2>
      <ul>
        {data.map((gist: any) => (
          <li key={gist.id}>
            <a href={gist.html_url}>{Object.keys(gist.files)[0]}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
