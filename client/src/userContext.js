import React, {useContext} from 'react';
import {Button, Form, Input, Label} from './components/styledComponents';

export const SetUser = () => {
    return (
        <Form onSubmit={findStudent}>
            <Label>BCS email address: </Label>
            <Input
            type='text'
            name='email'
            className='input student-input-email'
            value={email}
            placeholder='Enter your Bootcamp Spot email'
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setError()}
            />
            <Button>Submit</Button>
        </Form>
    )
}

export default SetUser;