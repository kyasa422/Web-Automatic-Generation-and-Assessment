import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

const CreateRole = ({ permissions, errors }) => {
    const [form, setForm] = useState({
        name: "",
        permission: {}
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setForm((prevForm) => ({
                ...prevForm,
                permission: {
                    ...prevForm.permission,
                    [value]: checked ? value : undefined,
                },
            }));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post(route("roles.store"), form);
    };

    return (
        <div>
            <div className="row">
                <div className="col-lg-12 margin-tb">
                    <h2>Create New Role</h2>
             
                </div>
            </div>

            {errors && Object.keys(errors).length > 0 && (
                <div className="alert alert-danger">
                    <strong>Whoops!</strong> There were some problems with your input.<br /><br />
                    <ul>
                        {Object.values(errors).map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <strong>Name:</strong>
                            <input type="text" name="name" placeholder="Name" className="form-control" value={form.name} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group">
                            <strong>Permission:</strong>
                            <br />
                            {permissions.map((value) => (
                                <label key={value.id}>
                                    <input type="checkbox" name="permission" value={value.id} checked={!!form.permission[value.id]} onChange={handleChange} className="name" />
                                    {value.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-12 text-center">
                        <button type="submit" className="btn btn-primary btn-sm mb-3">
                            <i className="fa-solid fa-floppy-disk"></i> Submit
                        </button>
                    </div>
                </div>
            </form>

            <p className="text-center text-primary">
                <small>Tutorial by ItSolutionStuff.com</small>
            </p>
        </div>
    );
};

export default CreateRole;
