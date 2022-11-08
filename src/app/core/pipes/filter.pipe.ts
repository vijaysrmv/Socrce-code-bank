/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        filter.pipe.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        21/08/2018
Description            :        Pipes to filter product/document from the array list based on the id passed
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product.model';


@Pipe({ name: 'filterProducts' })
export class FilterProductsPipe implements PipeTransform {
	filteredArray: any;
	transform(value: Array<Product>, productId: string, type?: string) {
		if (value) {
			switch (type) {
				case 'BS':
					this.filteredArray = value.filter((item) => (item.productid === productId));
					break;
				case 'Insurance':
					this.filteredArray = value.filter((item) => (item.type === productId));
					break;
				default:
					this.filteredArray = value.filter((item) => this.filteredArray = item.productid === productId);
			}
			if (this.filteredArray.length > 1) {
				return [this.filteredArray[0]];
			}
			return this.filteredArray;
		} else {
			return [];
		}
	}
}

@Pipe({ name: 'filterDocuments' })
export class FilterDocumentsPipe implements PipeTransform {
	filteredArray: any;
	transform(doclist) {
		if (doclist) {
			this.filteredArray = doclist.map(doc => {
				if (doc.documents) {
					doc.documents = doc.documents.filter((item) => (item.uploaded === false));
				}
				return doc;
			});
			return this.filteredArray;
		} else {
			return [];
		}
	}
}
