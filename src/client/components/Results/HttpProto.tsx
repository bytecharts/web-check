import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';

const cardStyles = '';

const HttpProtoCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const proto = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {proto.protocol && <Row lbl="Protocol" val={proto.protocol} />}
      {proto.compressed !== undefined && (
        <Row lbl="Compressed?" val={proto.compressed ? '✅ Yes' : '❌ No'} />
      )}
      {proto.contentEncoding && <Row lbl="Content encoding" val={proto.contentEncoding} />}
      {proto.http3Advertised !== undefined && (
        <Row lbl="HTTP/3 advertised?" val={proto.http3Advertised ? '✅ Yes' : '❌ No'} />
      )}
      {proto.compressionVerdict && <p>{proto.compressionVerdict}</p>}
      {proto.http3Verdict && <p>{proto.http3Verdict}</p>}
    </Card>
  );
};

export default HttpProtoCard;
