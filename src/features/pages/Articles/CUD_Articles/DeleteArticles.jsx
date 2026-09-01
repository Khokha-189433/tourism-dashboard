import React from 'react'
import DeleteButton from "../../../../components/UI/DeleteButton"
export default function DeleteArticles({ArticlesId ,onDeleted}) {
  return (
    <DeleteButton
        endpoint={`/articles/${ArticlesId}`}
        itemId={ArticlesId}
        onDeleted={onDeleted}
        confirmationMessage="هل أنت متأكد من حذف المقال "
        successMessage="تم حذف المقال بنجاح"
        errorMessage="حدث خطأ أثناء حذف "
      />
  )
}

