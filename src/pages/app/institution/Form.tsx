import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormSwitch } from '@/components/forms/form-switch';
import { FormTextarea } from '@/components/forms/form-textarea';

import { type FormProps } from '@/components/forms/type';

export default function Form({ data, setData, errors, mode }: FormProps) {
    const isReadOnly = mode === 'read';

    return (
        <div className="space-y-4">
            <FormInput
                label="User Name"
                name="user_name"
                value={data.user_name}
                onChange={(e) => setData('user_name', e.target.value)}
                errors={errors}
                disabled={isReadOnly}
            />

            <FormInput
                label="User Email"
                name="user_email"
                value={data.user_email}
                onChange={(e) => setData('user_email', e.target.value)}
                errors={errors}
                disabled={isReadOnly}
            />

            <FormInput
                label="Institution Name"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                errors={errors}
                disabled={isReadOnly}
            />

            <FormInput
                label="Registration Number"
                name="registration_no"
                value={data.registration_no}
                onChange={(e) => setData('registration_no', e.target.value)}
                errors={errors}
                disabled={isReadOnly}
            />

            <FormInput
                label="No of Students"
                name="no_of_students"
                value={data.no_of_students}
                onChange={(e) => setData('no_of_students', e.target.value)}
                errors={errors}
                type="number"
                disabled={isReadOnly}
            />
            <FormInput
                label="No of Teachers"
                name="no_of_teachers"
                value={data.no_of_teachers}
                onChange={(e) => setData('no_of_teachers', e.target.value)}
                errors={errors}
                type="number"
                disabled={isReadOnly}
            />

            <FormSelect
                label="Type"
                name="type"
                options={[
                    { id: 1, name: 'Primary' },
                    { id: 2, name: 'Secondary' },
                    { id: 3, name: 'College' },
                ]}
                errors={errors}
                value={data.type}
                onChange={(value) => setData('type', value)}
                disabled={isReadOnly}
            />

            <FormInput
                label="Location"
                name="location"
                value={data.location}
                onChange={(e) => setData('location', e.target.value)}
                errors={errors}
                disabled={isReadOnly}
            />

            <FormSwitch
                label="Status"
                name="status"
                value={data.status}
                onChange={(val) => setData('status', val as true)}
                errors={errors}
                disabled={isReadOnly}
            />

            <FormInput
                label="Limit"
                name="limit"
                value={data.limit}
                onChange={(e) => setData('limit', e.target.value)}
                errors={errors}
                disabled={isReadOnly}
            />

            <FormTextarea
                label="Extra Infos"
                name="extra_infos"
                value={data.extra_infos}
                onChange={(e) => setData('extra_infos', e)}
                errors={errors}
                disabled={isReadOnly}
            />
        </div>
    );
}
