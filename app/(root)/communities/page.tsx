import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCommunities } from "@/lib/actions/community.actions";


const page = async () => {
 
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');

    // fetch communities
    const result = await fetchCommunities({
        searchString: '',
        pageNumber: 1,
        pageSize: 25,
    });



    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            {/* search bar */}

            <div className="mt-14 flex flex-col gap-9">
                {result.communities.length === 0 ? (
                    <p className="no-result">No Communities</p>
                ) : (
                    <>
                        {result.communities.map((community) => (
                            <UserCard 
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                imgUrl={community.image}
                                personType='Community'
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default page