import { useNavigate, useSearchParams } from "react-router";
import ComponentBuilder from "../../../components/htmlbuilder/Builder/ComponentBuilder";
import { useGetHtmlComponentByIdQuery } from "../../../redux/htmlbuilder/htmlBuilderAPI";


const ComponentBuilderPage = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const navigate = useNavigate();

    const { data: componentData, isLoading } = useGetHtmlComponentByIdQuery(Number(id), {
        skip: !id,
    });

    const handleBack = () => {
        navigate("/superadmin/componentbuilder");
    };

    if (id && isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <ComponentBuilder
            onBack={handleBack}
            initialData={componentData?.Data}
        />

    );
};

export default ComponentBuilderPage;
