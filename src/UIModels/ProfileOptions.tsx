
interface ProfileOptionsProps {
    show: boolean;
    onClick: () => void;
    count: number;
    type: string;
}

const ProfileOptions: React.FC<ProfileOptionsProps> = ({ show, onClick, count, type }) => {
    return (
        <p onClick={onClick} className={`profile_follow-following  ${!show ? 'bg-white text-black' : 'text-white bg-black'} rounded-md`}>
            <span >
                {count}
            </span>
            {type}
        </p>
    )
}

export default ProfileOptions;