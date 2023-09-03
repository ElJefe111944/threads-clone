import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchUser, getActivity } from "@/lib/actions/user.actions";


const page = async () => {

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
    </section>
  )
}

export default page