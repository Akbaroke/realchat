import { DEFAULT_FOTO } from '@/assets';
import Button from '@/components/atoms/Button';
import ModalLogout from '@/components/organisms/ModalLogout';
import ModalProfilePicture from '@/components/organisms/ModalProfilePicture';
import { RootState } from '@/store';
import { FiChevronLeft } from 'react-icons/fi';
import { HiOutlineExclamationCircle, HiOutlineLogout } from 'react-icons/hi';
import { IoMdStarOutline } from 'react-icons/io';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <div className="flex items-center px-5 py-3 border-b sticky top-0 gap-5">
        <div
          className="p-2 rounded-md border w-max text-gray-500 cursor-pointer hover:text-black transition-all"
          onClick={() => navigate('/')}>
          <FiChevronLeft size={16} />
        </div>
        <h1 className="font-semibold">Profile</h1>
      </div>
      <div>
        <div className="flex items-center gap-7 p-5 border-b-4 border-gray-100">
          <ModalProfilePicture imgSrc={user?.foto || DEFAULT_FOTO}>
            <LazyLoadImage
              alt="foto"
              effect="blur"
              src={user?.foto || DEFAULT_FOTO}
              className="w-20 h-20 rounded-full bg-gray-200"
            />
          </ModalProfilePicture>
          <div className="flex flex-col gap-1 flex-1">
            <h1 className="font-bold text-[20px]">{user?.name}</h1>
            <p className="text-gray-500 text-[14px] font-medium">
              {user?.email}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('edit')}>
              Edit Profile
            </Button>
          </div>
        </div>
        <div className="flex flex-col p-5">
          <Link
            to="/rating"
            className="flex items-start gap-5 border-b py-5 cursor-pointer">
            <IoMdStarOutline size={30} className="text-gray-500" />
            <div className="flex flex-col gap-1">
              <h1 className="font-medium">Rating</h1>
              <p className="text-gray-500 text-[14px]">see and rate this app</p>
            </div>
          </Link>
          <Link
            to="/about"
            className="flex items-start gap-5 border-b py-5 cursor-pointer">
            <HiOutlineExclamationCircle
              size={25}
              className="text-gray-500 ml-1"
            />
            <div className="flex flex-col gap-1">
              <h1 className="font-medium">About</h1>
              <p className="text-gray-500 text-[14px]">about the application</p>
            </div>
          </Link>
          <ModalLogout>
            <div className="flex items-start gap-5 border-b py-5 cursor-pointer">
              <HiOutlineLogout size={25} className="text-red-500 ml-1" />
              <div className="flex flex-col gap-1">
                <h1 className="font-medium text-red-500">Logout</h1>
                <p className="text-gray-500 text-[14px]">
                  Exit from your account
                </p>
              </div>
            </div>
          </ModalLogout>
        </div>
      </div>
    </div>
  );
}
