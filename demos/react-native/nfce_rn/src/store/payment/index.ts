import api from "../../service/apiPix"
import { Pedido } from "../pedidos/types"


export async function generatePaymentPix(pedido: Pedido) {
  try {
    const auth = await api.post('oauth2/token', {
      "grant_type": "client_credentials",
      "role": "company"
    },
    {
      headers: {
        authorization: `Basic MWs3djVqcHI3MGdqczcwOTg2MWNtNzFoaGc6MWNkOHM4OGxjMW5ncDd1cTNiaW9ldmNzYW84MmhsZzIwNTh0dGszcHUyb2owYWtqNjU5bg==`,
        "Content-Type": "application/json"
      }
    })

    const bearer = auth.data.access_token

    if (!bearer) return ({ isValid: false })

    const createPix = await api.post('api/v1/pix/dynamic', {
      "accountId": "adc3f2ed-e6b3-4d11-8607-dd231fd4ce73",
      "amount": 1,
      "duration": 120,
      "description": "Demonstração ERP Summit - Tecnospeed",
      "aditionalInformation": [
        {
          "name": "Evento",
          "value": "ERP Summit - Tecnospeed"
        }
      ]
    },
    {
      headers: {
        authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json"
      }
    })

    if (!createPix.data) return ({ isValid: false })

    if (createPix.data.status !== 'SAVED') return ({ isValid: false })

    const findPix = await api.get(`api/v1/pix/${createPix.data.id}`, {
      headers: {
        authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json"
      }
    })

    if (!findPix.data) return ({ isValid: false })
      return ({ isValid: true, pix: { ...findPix.data, bearer } })
  } catch (error) {
    console.log(error)
    return ({ isValid: false})
  }
}

export async function verifyPaymentPix({ id, bearer }: { id: string, bearer: string }) {
  try {
    const { data } = await api.get(`api/v1/pix/${id}`, {
      headers: {
        authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json"
      }
    })

    if (!data) return ({ isValid: false })
      return ({ isValid: true, pix: data })
  } catch (error) {
    console.log(error)
    throw new Error('Não foi possível processar pagamento!')
  }
}
