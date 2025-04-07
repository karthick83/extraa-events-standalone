import { SfLoaderCircular } from '@storefront-ui/react';

export default function Loader() {
  return (
    <div className="flex text-black  w-full justify-center items-center">
    <div className="lds-roller text-black"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  );
}
