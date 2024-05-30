
import FollowersTabs from './FollowersTabs';
import PostsTab from './PostsTab';
import FollowingTab from './FollowingTab';


interface IProfileTabsProps {
    showFollowers: boolean,
    showPosts: boolean,
    showFollowing: boolean,
    currentProfileUserData: {
        userId: string,
        userProfile: string,
        userName: string;
        name: string;
    }
}



const Profiletabs: React.FC<IProfileTabsProps> = ({ currentProfileUserData, showFollowers, showFollowing, showPosts }) => {

    return (

        <div className='w-full h-fit'>

            <FollowersTabs
                id={currentProfileUserData.userId}
                showFollowers={showFollowers}
            />
            <FollowingTab
                id={currentProfileUserData.userId}
                showFollowing={showFollowing}
                type='profile'
            />
    
        </div>


    )
};

export default Profiletabs;