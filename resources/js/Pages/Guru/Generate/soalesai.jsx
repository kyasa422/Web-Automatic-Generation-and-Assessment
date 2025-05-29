import DefaultLayout from "@/Layouts/DefaultLayout";
import FormConfigure from "./components/FormConfigure";
import ListData from "./components/ListData";
import AnswerTypeChoiceAndSubmit from "./components/answerTypeChoiceAndSubmit";

const page = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Generate Soal Ujian
                        </h3>
                    </div>

                    <FormConfigure />
                </div>

                <ListData />
                <AnswerTypeChoiceAndSubmit />
            </div>
        </DefaultLayout>
    );
};

export default page;
