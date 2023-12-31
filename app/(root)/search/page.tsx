
import UserCard from "@/components/cards/UserCard";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import SearchBar from "@/components/shared/SearchBar";


const page = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');

    // fetch users
    const result = await fetchUsers({
        userId: user.id,
        searchString: searchParams.q,
        pageNumber: 1,
        pageSize: 25,
    });



    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            {/* search bar */}
            <SearchBar routeType="search" />

            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className="no-result">No users</p>
                ) : (
                    <>
                        {result.users.map((user) => (
                            <UserCard 
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                username={user.username}
                                imgUrl={user.image}
                                personType='User'
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default page