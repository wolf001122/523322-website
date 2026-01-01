export const onRequest = async ({ env }) => {
  const navigation = await env.SITE_NAVIGATION.get("navigation");
  if (!navigation) {
    return new Response("Navigation not found", { status: 404 });
  }
  return new Response(navigation, {
    headers: { "Content-Type": "application/json" }
  });
};
