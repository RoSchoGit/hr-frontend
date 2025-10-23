import type { FC, ReactNode } from "react";
import Header from "@/components/Header";
import PageWrapper from "@/components/PageWrapper";
import SmartText from "@/components/SmartText";

interface DetailField {
    label: string;
    value: string | ReactNode;
}

interface DetailPageProps {
    title?: string | ReactNode;
    description?: string | ReactNode;
    fields?: DetailField[];       // z. B. Typ, Status, Ersteller
    lists?: { title: string; items: (string | ReactNode)[] }[]; // z. B. Tasks, History, Industries
    metadata?: any;               // optional JSON Metadata
}

const DetailPage: FC<DetailPageProps> = ({ title, description, fields = [], lists = [], metadata }) => {
    return (
        <>
            <PageWrapper>
                <SmartText variant="h2" className="text-gray-600">
                    {title}
                </SmartText>
                {description && (
                    <SmartText variant="h2" className="text-gray-600">
                        {description}
                    </SmartText>
                )}

                {fields.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        {fields.map((f) => (
                            <div key={f.label}>
                                <SmartText variant="h2" className="font-semibold">{f.label}</SmartText>
                                <SmartText>{f.value}</SmartText>
                            </div>
                        ))}
                    </div>
                )}

                {lists.map((list) => (
                    <div key={list.title}>
                        <SmartText variant="h2" className="font-semibold">{list.title}</SmartText>
                        <ul className="list-disc pl-6">
                            {list.items.length > 0 ? (
                                list.items.map((item, i) => <li key={i}><SmartText>{item}</SmartText></li>)
                            ) : (
                                <li><SmartText>Keine Einträge</SmartText></li>
                            )}
                        </ul>
                    </div>
                ))}

                {metadata && (
                    <div>
                        <SmartText variant="h2" className="font-semibold">Metadata</SmartText>
                        <pre className="bg-surface p-2 rounded text-sm overflow-x-auto">
                            <SmartText>{JSON.stringify(metadata, null, 2)}</SmartText>
                        </pre>
                    </div>
                )}
            </PageWrapper>
        </>
    );
};

export default DetailPage;
