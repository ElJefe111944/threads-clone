import SearchBar from "@/components/shared/SearchBar";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCard";


const page = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');

    // fetch communities
    const result = await fetchCommunities({
        searchString: searchParams.q,
        pageNumber: 1,
        pageSize: 25,
    });



    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            {/* search bar */}
            <div className='mt-5'>
                <SearchBar routeType='communities' />
            </div>


            <div className="mt-14 flex flex-col gap-9">
                {result.communities.length === 0 ? (
                    <p className="no-result">No Communities</p>
                ) : (
                    <>
                        {result.communities.map((community) => (
                            <CommunityCard
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                imgUrl={community.image}
                                bio={community.bio}
                                members={community.members}
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default page