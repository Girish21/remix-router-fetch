import {
  HeadersFunction,
  json,
  LoaderFunction,
  MetaFunction,
  useRouteData,
} from "remix";
import { Navbar } from "../../components/nav/navbar";

type MemberInfo = {
  avatar_url: string;
  login: string;
  bio: string;
  twitter_username: string;
};

type RepoInfo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  fork: boolean;
};

type Response = {
  userdata: MemberInfo;
  userrepos: RepoInfo[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const [userinfoRes, userRepoRes] = await Promise.all([
    fetch(`https://api.github.com/users/${params.member}`),
    fetch(`https://api.github.com/users/${params.member}/repos`),
  ]);

  const data = await userinfoRes.json();
  const repos = (await userRepoRes.json()) as RepoInfo[];

  return json(
    {
      userdata: data,
      userrepos: repos.filter((repo: RepoInfo) => !repo.fork).slice(0, 20),
    },
    { headers: { "Cache-Control": "max-age=3600" } }
  );
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data.userdata.login,
  };
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") || `max-age=${60 * 60}`,
  };
};

export default function TeamMember() {
  const { userdata, userrepos } = useRouteData<Response>();

  return (
    <>
      <Navbar />
      <main className="grid grid-cols-[calc(100%-1400px),1fr,calc(100%-1400px)]">
        <section className="col-start-2 col-end-3">
          <header className="w-8/12 bg-white rounded-lg mx-auto mt-16 flex justify-center items-center">
            <div className="flex-1 flex flex-col items-center pb-6">
              <img
                className="-mt-12 w-24 h-24 rounded-full object-cover object-center"
                src={userdata.avatar_url}
                alt={userdata.login}
              />
              <a
                href={`https://twitter.com/${userdata.twitter_username}`}
                rel="noopener"
                target="_blank"
              >
                <h2 className="text-2xl font-bold mt-4">
                  {userdata.twitter_username}
                </h2>
              </a>
            </div>
          </header>
          <ul className="mt-8 space-x-4">
            {userrepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener"
              >
                <li className="bg-white shadow-md rounded-md p-4">
                  <h4 className="mb-3 text-xl font-bold text-gray-800">{repo.name}</h4>
                  <p className="text-gray-600">{repo.description}</p>
                </li>
              </a>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
