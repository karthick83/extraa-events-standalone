import { SfButton, SfDropdown, SfIconLogout, SfIconPerson } from "@storefront-ui/react";

export default function LoginBtn({ isLoggedIn, isDropDown, dropDownClose, onAccountClick, onMyOrderClick, onMyCoupons, onLogoutClick, onLoginClick }) {

    return (
        <>
            {isLoggedIn ?

                <SfDropdown className='z-50' trigger={
                    <SfButton
                        className=" bg-extraa-yellow hover:bg-primary-800 hover: active:bg-primary-900 "
                        aria-label={'Account'}
                        variant="tertiary"
                        slotPrefix={<SfIconPerson />}
                        square
                        onClick={() => onLoginClick({ 'role': 'account' })}
                    />}
                    open={isDropDown} onClose={dropDownClose}>

                    <ul className="p-2 z-10 rounded-lg bg-gray-100 w-[150px] cursor-pointer uc-sb mr-6">
                        {/* Accounts */}
                        <li>
                            <div className='py-2 px-4 items-center' onClick={onAccountClick}>
                                <h3 className="text-sm font-medium text-gray-900">Account</h3>
                            </div>
                            <div className="border-[1px] border-slate-300 mt-2"></div>
                        </li>
                        {/* My orders */}
                        <li>
                            <div className='py-2 px-4 items-center' onClick={onMyOrderClick}>
                                <h3 className="text-sm font-medium text-gray-900">My Orders</h3>
                            </div>
                            <div className="border-[1px] border-slate-300 mt-2"></div>
                        </li>
                        {/* My Coupons */}
                        <li>
                            <div className='py-2 px-4 items-center' onClick={onMyCoupons}>
                                <h3 className="text-sm font-medium text-gray-900">My Coupons</h3>
                            </div>
                            <div className="border-[1px] border-slate-300 mt-2"></div>
                        </li>
                        {/* Wishlist */}
                        {/* <li>
                      <div className='py-2 px-4 flex flex-row justify-between items-center' >
                        <h3 className="text-sm font-medium text-gray-900 mt-1">Wishlist</h3>
                        <SfIconFavorite size='sm' />
                      </div>
                      <div className="border-[1px] border-slate-300 mt-2"></div>
                    </li> */}
                        {/* logout */}
                        <li>
                            <div className='py-2 px-4 flex flex-row justify-between items-center' onClick={onLogoutClick}>
                                <h3 className="text-sm font-medium text-gray-900 mt-1">Logout</h3>
                                <SfIconLogout size='sm' onClick={onLogoutClick} />
                            </div>
                        </li>
                    </ul>
                </SfDropdown>
                :
                <SfButton
                    className=" bg-extraa-yellow text-extraa-dark-purple text-sm "
                    aria-label={'login'}
                    variant="tertiary"
                    onClick={() => onLoginClick({ role: 'login' })}
                >
                    Login
                </SfButton>
            }
        </>
    )
}