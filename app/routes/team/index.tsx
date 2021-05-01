import {
  HeadersFunction,
  json,
  Link,
  LoaderFunction,
  MetaFunction,
  useRouteData,
} from "remix";
import { Navbar } from "../../components/nav/navbar";

type RouteDataType = {
  login: string;
  id: number;
  avatar_url: string;
};

export const loader: LoaderFunction = async () => {
  const res = await fetch("https://api.github.com/orgs/reacttraining/members");
  const data = await res.json();

  return json(data, {
    headers: { "Cache-Control": `max-age=${24 * 60 * 60}` },
  });
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") || `max-age=${60 * 60}`,
  };
};

export const meta: MetaFunction = () => {
  return {
    title: "Teams page",
    description: "Teams page of XYZ org",
  };
};

export default function Team() {
  const data = useRouteData<RouteDataType[]>();

  return (
    <>
      <Navbar />
      <h2>Teams Page</h2>
      <ul className='mt-4 space-y-4'>
        {data.map((user) => (
          <li key={user.id}>
            <Link to={`${user.login}`} className="flex items-center space-x-6 w-max">
              {user.avatar_url && (
                <img
                  className="rounded-full w-6 h-6 object-cover object-center"
                  src={user.avatar_url}
                  alt={user.login}
                />
              )}
              <h6 className="text-2xl font-bold">{user.login}</h6>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
