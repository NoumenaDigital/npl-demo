# NPL-demo

This is a stand-alone NPL demo project that showcases various NPL features. The NPL documentation is available [here](https://documentation.noumenadigital.com).

## Installation

Clone the project using:

```
git clone git@github.com:NoumenaDigital/npl-demo.git
```

A version of the NPL IDEA Plugin can be found in `/plugin`. The `.7z.00x` files in the version folder should be decompressed (for example using 7zip or p7zip), and when done so will produce a file `npl-idea-plugin-0.29.1.zip`. This `zip` file can be used in IntelliJ directly.

Install the plugin `zip` file according to the manual installation instructions found [here](https://documentation.noumenadigital.com/docs/tools/plugin/guide/Installation/#manual-installation).

In IntelliJ, go to `File`, `Open...`, navigate to the directory, and simply open it. Once imported, right click on the folder `src/main/npl`, go to `Mark directory as` and select `Sources Root`. Similarly mark `src/main/test` as `Test Sources Root`.

You should now be able to start programming NPL!
