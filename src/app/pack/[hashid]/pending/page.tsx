type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { slug: string };
};

export default function Page({ params }: Props) {
  return <div>pending join requests page</div>;
}
