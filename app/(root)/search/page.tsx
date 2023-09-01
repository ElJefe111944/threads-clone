
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";


const page = async () => {

    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');

    // fetch users
    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25,
    });



    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            {/* search bar */}

            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className="no-result">No users</p>
                ) : (
                    <>
                        {result.users.map((user) => (
                            <UserCard 
                                
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default page