import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';

const cardStyles = '';

const CtAgeCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const ct = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {ct.domain && <Row lbl="Domain" val={ct.domain} />}
      {ct.firstSeen && <Row lbl="First seen" val={ct.firstSeen} />}
      {typeof ct.ageDays === 'number' && (
        <Row lbl="Age" val={ct.ageDays === 0 ? 'Less than a day' : `${ct.ageDays} days`} />
      )}
      {typeof ct.certCount === 'number' && <Row lbl="Certificates logged" val={ct.certCount} />}
    </Card>
  );
};

export default CtAgeCard;
