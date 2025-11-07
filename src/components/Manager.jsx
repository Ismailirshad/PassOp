import { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faCopy, faTrash, faPenToSquare, faUser } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast, Bounce } from 'react-toastify';

function Manager() {
    const ref = useRef()
    const [showIcon, setShowIcon] = useState(false)
    const [form, setForm] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("https://your-render-app.onrender.com/passwords");
        let passwords = await req.json();
        console.log("fetched passowrds", passwords)
        if (passwords) {
            setPasswordArray(passwords)
        }
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const showPassword = () => {
        if (ref.current.type === 'password') {
            ref.current.type = 'text'
            setShowIcon(true)
        } else {
            ref.current.type = 'password'
            setShowIcon(false)
        }
    }


    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            try {
                if (form._id) {
                    // Delete old password first
                    await fetch("https://your-render-app.onrender.com/passwords", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ _id: form._id }),
                    });
                }

                // Prepare data to save (remove id so Mongo creates new _id)
                const { _id, ...passwordData } = form;

                // Save new password
                const res = await fetch("https://your-render-app.onrender.com/passwords", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(passwordData),
                });

                const data = await res.json();

                if (data.success) {
                    toast('Password saved');
                    setForm({ site: "", username: "", password: "" });
                    getPasswords();  // Refresh list
                } else {
                    toast('Error saving password');
                }
            } catch (err) {
                console.error(err);
                toast('Error saving password');
            }
        } else {
            toast('Password not saved, Less character password');
        }
    };

    const deletePassword = async (id) => {
        if (!window.confirm("Do you want to delete this password?")) return;

        try {
            const res = await fetch("https://your-render-app.onrender.com/passwords", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: id })
            });

            const data = await res.json();

            if (data.success) {
                setPasswordArray(prev => prev.filter(item => item._id !== id));
                toast('Password deleted successfully', {
                    position: "bottom-center",
                    autoClose: 1000,
                    theme: "colored"
                });
            } else {
                toast('Failed to delete password');
            }
        } catch (err) {
            console.error(err);
            toast('Error deleting password');
        }
    };


    const editPassword = (id) => {
        console.log("editing password with id", id)
        setForm(passwordArray.filter(i => i._id === id)[0])
        setPasswordArray(passwordArray.filter(item => item._id !== id))
    }
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const copyText = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => toast('Copied to clipboard'))
            .catch(() => toast('Failed to copy'));
    };

    return (
        <div>
            <ToastContainer
                position="bottom-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
            <div className="absolute top-0 z-[-2]  h-screen w-screen bg-green-50 bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
            <div className="mx-auto container   md:mycontainer">
                <h1 className='text-4xl  text-center w-full font-bold '>
                    <span className='text-green-500' >&lt;</span>
                    Pass
                    <span className='text-green-500' >OP/&gt; </span>
                </h1>
                <p className='text-green-900 text-lg  text-center'>Your own Password Manager</p>
                <div className="text-black items-center w-full mx-auto md:w-3/4 flex flex-col p-4 gap-8">
                    <input onChange={handleChange} name='site' value={form.site} placeholder='Enter website URL' className='rounded-xl border border-green-500 w-full text-black p-4 py-1' type="text" id='site' />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input onChange={handleChange} name='username' value={form.username} placeholder='Enter Username' className='rounded-xl border border-green-500 w-full text-black p-4 py-1' type="text" id='username' />

                        <div className='relative'>
                            <input onChange={handleChange} name='password' value={form.password} ref={ref} placeholder='Enter Password' className='rounded-xl border border-green-500 w-full text-black p-4 py-1' type="password" id='password' />
                            <span className='absolute right-2 top-1 cursor-pointer' onClick={showPassword}>
                                <FontAwesomeIcon icon={showIcon ? faEyeSlash : faEye} />
                            </span>
                        </div>
                    </div>

                    <button onClick={savePassword}
                        className='flex justify-center items-center gap-2 bg-green-400 w-fit rounded-full px-20 py-0.5 font-bold border border-green-900 hover:bg-green-300'>
                        <lord-icon
                            src="https://cdn.lordicon.com/vjgknpfx.json"
                            trigger="hover"
                        >
                        </lord-icon>
                        Save
                    </button>
                </div>
            </div>

            <div className='passwords '>
                <h2 className='text-center font-bold text-xl'>Your Passwords</h2>
                {passwordArray.length === 0 && <div>No passwords to show </div>}
                {passwordArray.length != 0 && <table className="table w-full md:w-3/4 mb-7 mx-auto rounded-md overflow-hidden">
                    <thead className='bg-green-800  text-white'>
                        <tr>
                            <th className='py-2'>Site</th>
                            <th className='py-2'>Username</th>
                            <th className='py-2'>Password</th>
                            <th className='py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-green-200 ' >
                        {passwordArray.map((item) => {
                            return <tr key={item._id} >
                                <td className='py-2 text-center w-10 border space-x-3 border-white cursor-pointer' onClick={() => copyText(item.site)}><a href={item.site} target="_blank"> {item.site}</a>
                                    <FontAwesomeIcon icon={faCopy} />.
                                </td>
                                <td className='py-2 text-center w-32 border space-x-3 border-white cursor-pointer' onClick={() => copyText(item.username)}  >{item.username}
                                    <FontAwesomeIcon icon={faUser} />
                                </td>
                                <td className='py-2 text-center w-32 border space-x-3 border-white cursor-pointer' onClick={() => copyText(item.password)} >{item.password}
                                    <FontAwesomeIcon icon={faEye} />
                                </td>
                                <td className='py-2 text-center w-32 gap-3 border border-white cursor-pointer'>
                                    <div className='flex justify-center gap-3'>
                                        Delete
                                        <span onClick={() => { deletePassword(item._id) }}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </span>
                                        <span onClick={() => { editPassword(item._id) }}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>}
            </div>
        </div>
    )
}

export default Manager
