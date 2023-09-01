import Image from "next/image";

interface UserCardProps {
    id: string;
    name: string;
    username: string;
    imgUrl: string;
    personType: string;
}

function UserCard({ id, name, username, imgUrl, personType }:UserCardProps) {
  return (
    <article className="user-card">
        <div className="user-card_avatar">
            <Image src={imgUrl} alt="logo" width={48} height={48} className="rounded-full" />
        </div>
    </article>
  )
}

export default UserCard