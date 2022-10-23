import React from 'react';
import * as toastr from 'toastr';
import Category from "../../models/category";
import BaseService from '../../service/base.service';
import { CategoryPage } from './page.form';
import { History } from 'history';


interface IProps {
    history: History;
    //Map properties match
    match: {
        isExact: boolean
        params: {
            id: string
        },
        path: string,
        url: string,
    }
}
interface IState {
    category: Category,
    action:string
}


class EditCategory extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            category: {
                uid: 0,
                name: '',
                description: '',
                categoryId: null,
            },
            action:"modification"
        }
        this.onFieldValueChange = this.onFieldValueChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    private onSelect(event: any) {
        const nextState = {
            ...this.state,
            category: {
                ...this.state.category,
                [event.target.name]: event.target.value,
            }
        };

        this.setState(nextState);
    }

    private onFieldValueChange(fieldName: string, value: string) {
        const nextState = {
            ...this.state,
            category: {
                ...this.state.category,
                [fieldName]: value,
            }
        };

        this.setState(nextState);
    }

    public componentDidMount() {
        BaseService.get<Category>('/category/', this.props.match.params.id).then(
            (rp) => {
                if (rp.status === 200) {

                    const category = rp.data;
                    this.setState({ category: new Category(category.uid, category.name, category.description, category.categoryId) });
                } else {
                    toastr.error(rp.Messages);
                    console.log("Messages: " + rp.Messages);
                    console.log("Exception: " + rp.Exception);
                }
            }

        );
    }


    private onSave = () => {
        BaseService.update<Category>("/category/", this.props.match.params.id, this.state.category).then(
            (rp) => {
                if (rp.status === 200) {
                    toastr.success('Member saved.');
                    this.setState({
                        category: {
                            name: '',
                            description: '',
                            categoryId: null,
                            uid: undefined,
                        }
                    });
                    this.props.history.goBack();
                } else {
                    toastr.error(rp.message);
                }
            }
        );

    }

    render() {
        return (
            <CategoryPage
                category={this.state.category}
                onChange={this.onFieldValueChange}
                onSave={this.onSave}
                onSelect={this.onSelect}
                action={this.state.action}
            />
        );
    }

}
export default EditCategory;