import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import InputField from "../../../../components/form/input/InputField";
import Checkbox from "../../../../components/form/input/Checkbox";
import toaster from "../../../../components/toster";
import TextArea from "../../../../components/form/input/TextArea";
import { useGetPermitByIdQuery, useSavePermitMutation } from "../../../../redux/trek/permitAPI";
import { PermitSaveRequest } from "../../../../types/trekTypes";

const PermitForm = () => {


    return (
        <>

        </>
    );
};

export default PermitForm;
