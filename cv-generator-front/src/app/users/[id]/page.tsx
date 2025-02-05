export default async function UserPage({
    params,
  }: {
    params: Promise<{ id: string; }>
  }) {
    const id = (await params).id
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const user = await res.json();
  
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">User: {user.name}</h1>
        <p>Email: {user.email}</p>
      </main>
    );
  }
  