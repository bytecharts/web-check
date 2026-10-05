import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';

const cardStyles = '';

const MetaTagsCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const meta = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {meta.title && <Row lbl="Title" val={meta.title} />}
      {typeof meta.titleLength === 'number' && (
        <Row lbl="Title length" val={`${meta.titleLength} characters`} />
      )}
      {meta.titleVerdict && <p>{meta.titleVerdict}</p>}
      {meta.description && <Row lbl="Description" val={meta.description} />}
      {typeof meta.descriptionLength === 'number' && (
        <Row lbl="Description length" val={`${meta.descriptionLength} characters`} />
      )}
      {meta.descriptionVerdict && <p>{meta.descriptionVerdict}</p>}
    </Card>
  );
};

export default MetaTagsCard;
