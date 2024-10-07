import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { GrValidate } from "react-icons/gr";
import useStore from "../components/context/useStore";

const VarifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (router.query.token) {
        const res = await fetch(`/api/login?varifyEmail=${router.query.token}`);
        if (res.ok) {
          setSuccess(true);
          router.push(store?.redirect);
        } else setSuccess(false);
      }
      setLoading(false);
    })();
  }, [router.query]);

  if (loading)
    return (
      <div className='text-center mt-20 text-xl'>
        <p>Loading...</p>
      </div>
    );
  return (
    <div
      className={`varification-container ${success ? "success" : "unsuccess"}`}
    >
      {success ? <GrValidate /> : <BiErrorCircle />}
      <h3>{success ? "Varification Successfull!" : "Varification Faild"}</h3>
    </div>
  );
};

export default VarifyEmail;
