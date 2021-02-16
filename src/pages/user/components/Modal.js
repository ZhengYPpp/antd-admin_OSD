import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import { Trans } from '@lingui/react'
import city from 'utils/city'

// diff
import { diff } from 'deep-object-diff'


const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

class UserModal extends PureComponent {
  state = {changeValue: {}}

  formRef = React.createRef()

  handleOk = () => {
    const { item = {}, onOk } = this.props

    this.formRef.current.validateFields()
      .then(values => {
        const data = {
          ...values,
          key: item.key,
        }
        data.address = data.address.join(' ')
        onOk(data)
      })
      .catch(errorInfo => {
        console.log(errorInfo)
      })
  }

  handleCheckFieldChange = (e, v) => {
    this.setState({ changeValue: { ...v } })
  }


  handleAfterClose = () => {
    this.setState({ changeValue: {} })
  }

  handleOnCancel = (checkChange) => {
    const { onCancel } = this.props

    onCancel(checkChange)
  }


  render() {

    const { i18n, item = {}, onOk, onCancel, form, ...modalProps } = this.props

    const { changeValue } = this.state

    const { avatar, createTime, id, ...restItem } = item

    const currentValue = {
      ...restItem,
      address: item.address && item.address.split(' '),
    }

    const different = diff(currentValue, changeValue)

    const changed = Object.keys(changeValue).length > 0

    const okButtonProps = {
      disabled: !changed || !Object.keys(different).length > 0 ? true : false,
    }

    const checkChange = changed && Object.keys(different).length > 0


    return (
      <Modal {...modalProps} 
      onOk={this.handleOk}         
      okButtonProps={okButtonProps}
      onCancel={() => this.handleOnCancel(checkChange)}
      destroyOnClose
      afterClose={this.handleAfterClose}
>
        <Form ref={this.formRef} name="control-ref" initialValues={{ ...item, address: item.address && item.address.split(' ') }} layout="horizontal" onValuesChange={this.handleCheckFieldChange}>
          <FormItem name='name' rules={[{ required: true }]}
            label={i18n.t`Name`} hasFeedback {...formItemLayout}>
            <Input />
          </FormItem>
          <FormItem name='nickName' rules={[{ required: true }]}
            label={i18n.t`NickName`} hasFeedback {...formItemLayout}>
            <Input />
          </FormItem>
          <FormItem name='isMale' rules={[{ required: true }]}
            label={i18n.t`Gender`} hasFeedback {...formItemLayout}>
            <Radio.Group>
              <Radio value>
                <Trans>Male</Trans>
              </Radio>
              <Radio value={false}>
                <Trans>Female</Trans>
              </Radio>
            </Radio.Group>
          </FormItem>
          <FormItem name='age' label={i18n.t`Age`} hasFeedback {...formItemLayout}>
            <InputNumber min={18} max={100} />
          </FormItem>
          <FormItem name='phone' rules={[{ required: true, pattern: /^1[34578]\d{9}$/, message: i18n.t`The input is not valid phone!`, }]}
            label={i18n.t`Phone`} hasFeedback {...formItemLayout}>
            <Input />
          </FormItem>
          <FormItem name='email' rules={[{ required: true, pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, message: i18n.t`The input is not valid E-mail!`, }]}
            label={i18n.t`Email`} hasFeedback {...formItemLayout}>
            <Input />
          </FormItem>
          <FormItem name='address' rules={[{ required: true, }]}
            label={i18n.t`Address`} hasFeedback {...formItemLayout}>
            <Cascader
              style={{ width: '100%' }}
              options={city}
              placeholder={i18n.t`Pick an address`}
            />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
}

export default UserModal
