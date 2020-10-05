import json
import requests

token = 'A64Zxw0ZH3qyM9aE3PzqqF2ZGLsiozYPXSPe88nmxBxIkbHVxF+gQRWOZXvHCau/a4db7uc0QHekaDVTYfY0irtBqCt4yMT/6ALBl9uEsZMjDqHi34cDmiiX6Xcj5ACZWOx6+nI6zgaLmnh0QV86lAdB04t89/1O/w1cDnyilFU='
headers = {
    "Authorization": 'Bearer {}'.format(token)
}

getUrl = 'https://api.line.me/v2/bot/richmenu/list'
delUrl = 'https://api.line.me/v2/bot/richmenu/'
createUrl = 'https://api.line.me/v2/bot/richmenu'
uploadUrl = 'https://api-data.line.me/v2/bot/richmenu/{}/content'
defaultUrl = 'https://api.line.me/v2/bot/user/all/richmenu/{}'
getDefaultUrl = 'https://api.line.me/v2/bot/user/all/richmenu'

if __name__ == '__main__':

    # delete
    # requests.delete(delUrl + 'richmenu-7356e08998d7b877621735bb1b87a06c', headers=headers)

    # get
    r = requests.get(getUrl, headers=headers)
    richmenus = r.json()['richmenus']
    print(richmenus)
    r = requests.get(getDefaultUrl, headers=headers)
    print(r.json())


    '''
    # post
    newRichmenu = {
        "name": "v1.3.0",
        "size": {
            "width": 2500,
            "height": 1686
        },
        "chatBarText": "OPEN MENU",
        "selected": True,
        "areas": [
            {
                "bounds": {
                    "x": 0,
                    "y": 0,
                    "width": 833,
                    "height": 843
                },
                "action": {
                    "type": "message",
                    "text": "查詢 彭花"
                }
            },
            {
                "bounds": {
                    "x": 833,
                    "y": 0,
                    "width": 833,
                    "height": 843
                },
                "action": {
                    "type": "message",
                    "text": "查詢 鑄鐵木"
                }
            },
            {
                "bounds": {
                    "x": 1666,
                    "y": 0,
                    "width": 833,
                    "height": 843
                },
                "action": {
                    "type": "message",
                    "text": "DIY 成熟型村民"
                }
            },
            {
                "bounds": {
                    "x": 0,
                    "y": 843,
                    "width": 555,
                    "height": 843
                },
                "action": {
                    "type": "message",
                    "text": "魚"
                }
            },
            {
                "bounds": {
                    "x": 555,
                    "y": 843,
                    "width": 555,
                    "height": 843
                },
                "action": {
                    "type": "message",
                    "text": "蟲"
                }
            },
            {
                "bounds": {
                    "x": 1110,
                    "y": 843,
                    "width": 556,
                    "height": 843
                },
                "action": {
                    "type": "message",
                    "text": "海底生物"
                }
            },
            {
                "bounds": {
                    "x": 1666,
                    "y": 843,
                    "width": 416,
                    "height": 843
                },
                "action": {
                    "type": "message",
                    "text": "意見回報"
                }
            },
            {
                "bounds": {
                    "x": 2082,
                    "y": 843,
                    "width": 416,
                    "height": 843
                },
                "action": {
                    "type": "message",
                    "text": "指令集"
                }
            }
        ]
    }

    richmenu_upgrade = {
        "name": "upgrade",
        "size": {
            "width": 2500,
            "height": 1686
        },
        "chatBarText": "點我查看更新",
        "selected": True,
        "areas": [
            {
                "bounds": {
                    "x": 0,
                    "y": 0,
                    "width": 2500,
                    "height": 1686
                },
                "action": {
                    "type": "message",
                    "text": "上次更新新增"
                }
            }
        ]
    }

    r = requests.post(createUrl, json=richmenu_upgrade, headers=headers)
    result = r.json()
    richMenuId = result['richMenuId']
    print(result)

    # richMenuId = ''
    # upload image
    url = uploadUrl.format(richMenuId)
    headers_ = {**headers, **{"Content-Type": "image/png"}}

    r = requests.post(url, data=open('../assets/richmenu_upgrade.png', 'rb'), headers=headers_)
    result = r.json()
    print(result)
    '''

    # set default
    richMenuId = richmenus[0]['richMenuId']
    r = requests.post(defaultUrl.format(richMenuId), headers=headers)
    result = r.json()
    print(result)
