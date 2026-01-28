import type { FC, ReactNode } from "react";
import PageWrapper from "@/components/PageWrapper";
import SmartText from "@/components/SmartText";
import "./DetailPage.css";

interface DetailField {
    label: string;
    value: string | ReactNode;
}

interface DetailPageProps {
    title?: string | ReactNode;
    description?: string | ReactNode;
    fields?: DetailField[];
    lists?: { title: string; items: (string | ReactNode)[] }[];
    metadata?: any;
}

const DetailPage: FC<DetailPageProps> = ({
    title,
    description,
    fields = [],
    lists = [],
    metadata,
}) => {
    return (
        <PageWrapper>
            <div className="detail-page">
                {title && (
                    <SmartText variant="h2" className="detail-page__title">
                        {title}
                    </SmartText>
                )}

                {description && (
                    <SmartText variant="h2" className="detail-page__description">
                        {description}
                    </SmartText>
                )}

                {fields.length > 0 && (
                    <div className="detail-page__fields">
                        {fields.map((f) => (
                            <div key={f.label} className="detail-page__field">
                                <SmartText
                                    variant="h2"
                                    className="detail-page__field-label"
                                >
                                    {f.label}
                                </SmartText>
                                <SmartText>{f.value}</SmartText>
                            </div>
                        ))}
                    </div>
                )}

                {lists.map((list) => (
                    <div key={list.title} className="detail-page__list">
                        <SmartText
                            variant="h2"
                            className="detail-page__list-title"
                        >
                            {list.title}
                        </SmartText>

                        <ul className="detail-page__list-items">
                            {list.items.length > 0 ? (
                                list.items.map((item, i) => (
                                    <li key={i}>
                                        <SmartText>{item}</SmartText>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <SmartText>Keine Einträge</SmartText>
                                </li>
                            )}
                        </ul>
                    </div>
                ))}

                {metadata && (
                    <div className="detail-page__metadata">
                        <SmartText
                            variant="h2"
                            className="detail-page__metadata-title"
                        >
                            Metadata
                        </SmartText>
                        <pre className="detail-page__metadata-content">
                            <SmartText>
                                {JSON.stringify(metadata, null, 2)}
                            </SmartText>
                        </pre>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default DetailPage;
