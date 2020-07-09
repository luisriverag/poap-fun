import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import { Col, Row, Tooltip } from 'antd';
import moment from 'moment-timezone';

// Components
import Input from 'ui/components/Input';
import InputSearch from 'ui/components/InputSearch';
import { Card } from 'ui/styled/antd/Card';
import { Form } from 'ui/styled/antd/Form';
import { Button } from 'ui/styled/antd/Button';
import { Container } from 'ui/styled/Container';
import Separator from 'ui/styled/Separator';
import Checkbox from 'ui/components/Checkbox';
import TitlePrimary from 'ui/components/TitlePrimary';
import PrizeRowForm from 'ui/components/PrizeRowForm';
import DatePicker from 'ui/components/DatePicker';
import TimePicker from 'ui/components/TimePicker';

// Helpers
import { injectErrorsFromBackend } from 'lib/helpers/formik';

// Schema
import RaffleCreateFormSchema from './schema';

// Types
import { Prize } from 'lib/types';
export type RaffleCreateFormValue = {
  name: string;
  description: string;
  contact: string;
  weightedVote: boolean;
  raffleDate: moment.Moment | undefined;
  raffleTime: moment.Moment | undefined;
};

const initialValues: RaffleCreateFormValue = {
  name: '',
  description: '',
  contact: '',
  weightedVote: false,
  raffleDate: undefined,
  raffleTime: undefined,
};

const RaffleCreateForm: FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const handleOnSubmit = async ({
    name,
    description,
    contact,
    weightedVote,
    raffleDate,
    raffleTime,
  }: RaffleCreateFormValue) => {
    console.log('name: ', name);
    console.log('description: ', description);
    console.log('contact: ', contact);
    console.log('weightedVote: ', weightedVote);
    console.log('raffleTime: ', raffleTime);
    console.log('raffleDate: ', raffleDate);
  };

  // Lib hooks
  const { values, errors, touched, handleChange, submitForm, setFieldValue } = useFormik({
    initialValues,
    validationSchema: RaffleCreateFormSchema,
    onSubmit: injectErrorsFromBackend<RaffleCreateFormValue>(handleOnSubmit),
  });

  const removePrize = (order: number) => {
    let newPrizes = prizes
      .filter((prize) => prize.order !== order)
      .map((prize, index) => {
        let newOrder = index + 1;
        return { ...prize, id: newOrder, order: newOrder };
      });
    setPrizes(newPrizes);
  };

  const addPrize = (value: string) => {
    if (!value || value.trim() === '') return;
    const position = prizes.length + 1;
    let newPrize: Prize = { id: position, order: position, name: value };
    setPrizes([...prizes, newPrize]);
  };

  const handleSubmitClick = () => submitForm();

  const timeLabel = (
    <>
      <Tooltip title={`Browser timezone: ${moment.tz.guess()}`}>
        <span>Raffle Time (UTC {moment().utcOffset() / 60})</span>
      </Tooltip>
    </>
  );

  return (
    <Container sidePadding thinWidth>
      <TitlePrimary title={'Create New Raffle'} goBack />
      <Card>
        <Form>
          <Row gutter={24}>
            <Col span={24}>
              <Input
                errors={errors}
                handleChange={handleChange}
                label="Raffle Name"
                name="name"
                placeholder="Enter a name so players can find it"
                touched={touched}
                values={values}
              />
            </Col>
            <Col span={24}>
              <Checkbox
                handleChange={handleChange}
                name="weightedVote"
                sideText="Weighted chance"
                helpText="Users with multiple POAPs have one ticket per POAP"
                values={values}
              />
            </Col>
            <Col offset={4} span={8}>
              <DatePicker
                setFieldValue={setFieldValue}
                name="raffleDate"
                label="Raffle Date"
                placeholder="Pick a date"
                futureDates
                touched={touched}
                errors={errors}
                values={values}
              />
            </Col>
            <Col span={8}>
              <TimePicker
                setFieldValue={setFieldValue}
                name="raffleTime"
                label={timeLabel}
                placeholder="Pick a time"
                touched={touched}
                errors={errors}
                values={values}
              />
            </Col>
            <Col span={24}>
              <Input
                errors={errors}
                handleChange={handleChange}
                label="Raffle Description"
                name="description"
                placeholder="Be creative"
                touched={touched}
                values={values}
              />
            </Col>
            <Col span={24}>
              <InputSearch
                name="prize"
                label="Prize"
                placeholder={`Enter whatever you want to raffle for the ${prizes.length + 1}º winner`}
                handleEnter={addPrize}
                buttonText={'Add'}
                helpText={'Add any amount of prizes you like to give away!'}
              />
            </Col>
            <Col span={24}>
              {prizes.length > 0 && (
                <>
                  <Separator />
                  {prizes.map((prize) => {
                    return (
                      <PrizeRowForm
                        key={prize.order}
                        order={prize.order}
                        prize={prize.name}
                        deleteAction={() => removePrize(prize.order)}
                      />
                    );
                  })}
                  <Separator />
                </>
              )}
            </Col>
            <Col span={24}>
              <Input
                errors={errors}
                handleChange={handleChange}
                label="Contact"
                name="contact"
                placeholder="Enter your email"
                helpText="Please, enter your email so the winners can contact you"
                touched={touched}
                values={values}
              />
            </Col>
          </Row>
        </Form>
      </Card>
      <Button onClick={handleSubmitClick} type="primary" margin>
        Submit
      </Button>
    </Container>
  );
};

export default RaffleCreateForm;
